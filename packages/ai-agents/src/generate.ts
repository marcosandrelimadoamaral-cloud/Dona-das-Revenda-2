import { GoogleGenAI } from "@google/genai";

/**
 * Geração de texto com plano B.
 *
 * Ordem de tentativa:
 *  1. o modelo pedido pelo agente;
 *  2. modelos estáveis do Gemini (GEMINI_FALLBACK_MODELS, separados por vírgula);
 *  3. um provedor reserva compatível com a API da OpenAI (FALLBACK_AI_BASE_URL,
 *     FALLBACK_AI_API_KEY, FALLBACK_AI_MODEL), por exemplo Groq ou OpenRouter.
 *
 * Erro de chave ou de crédito (401, 402, 403) vale para todos os modelos Gemini da mesma
 * chave, então a fila pula direto para o provedor reserva em vez de repetir o mesmo erro.
 */

export interface GenerateParams {
  model: string;
  contents: string;
  systemInstruction?: string;
  temperature?: number;
  json?: boolean;
  responseSchema?: unknown;
}

const DEFAULT_FALLBACK_MODELS = "gemini-2.5-pro,gemini-2.5-flash,gemini-2.5-flash-lite";

function modelQueue(primary: string): string[] {
  const extra = (process.env.GEMINI_FALLBACK_MODELS ?? DEFAULT_FALLBACK_MODELS)
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return Array.from(new Set([primary, ...extra]));
}

function statusOf(err: any): number {
  const s = Number(err?.status ?? err?.code ?? err?.error?.code);
  if (Number.isFinite(s) && s > 0) return s;
  const m = String(err?.message ?? "").match(/"code"\s*:\s*(\d{3})/);
  return m ? Number(m[1]) : 0;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class AIUnavailableError extends Error {
  constructor(message = "A IA está indisponível no momento.") {
    super(message);
    this.name = "AIUnavailableError";
  }
}

async function viaFallbackProvider(p: GenerateParams): Promise<string | null> {
  const base = process.env.FALLBACK_AI_BASE_URL;
  const key = process.env.FALLBACK_AI_API_KEY;
  const model = process.env.FALLBACK_AI_MODEL;
  if (!base || !key || !model) return null;

  const messages = [
    ...(p.systemInstruction ? [{ role: "system", content: p.systemInstruction }] : []),
    { role: "user", content: p.json && p.responseSchema ? `${p.contents}\n\nResponda somente com JSON que siga este esquema:\n${JSON.stringify(p.responseSchema)}` : p.contents },
  ];

  const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages,
      temperature: p.temperature ?? 0.7,
      ...(p.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Provedor reserva respondeu ${res.status}`);
  const json: any = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  return typeof text === "string" && text.trim() ? text : null;
}

export async function generateWithFallback(
  ai: GoogleGenAI,
  p: GenerateParams
): Promise<{ text: string; model: string; tokensUsed?: number }> {
  let lastError: any;
  let geminiBlocked = false;

  // AI_PREFER_FALLBACK=true: usa primeiro o provedor gratuito (ex.: Groq) e deixa o Gemini como reserva.
  const preferFallback = process.env.AI_PREFER_FALLBACK === "true";
  if (preferFallback) {
    try {
      const text = await viaFallbackProvider(p);
      if (text) return { text, model: process.env.FALLBACK_AI_MODEL!, tokensUsed: undefined };
    } catch (err: any) {
      console.error(`[IA] provedor principal (reserva) falhou: ${err?.message}`);
      lastError = err;
    }
  }

  for (const model of modelQueue(p.model)) {
    if (geminiBlocked) break;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: p.contents,
          config: {
            ...(p.systemInstruction ? { systemInstruction: p.systemInstruction } : {}),
            ...(p.temperature !== undefined ? { temperature: p.temperature } : {}),
            ...(p.json ? { responseMimeType: "application/json" } : {}),
            ...(p.responseSchema ? { responseSchema: p.responseSchema as any } : {}),
          },
        });
        const text = response.text;
        if (!text) throw new Error("Resposta vazia");
        return { text, model, tokensUsed: response.usageMetadata?.totalTokenCount };
      } catch (err: any) {
        lastError = err;
        const status = statusOf(err);
        console.error(`[IA] ${model} falhou (tentativa ${attempt}, status ${status || "?"}): ${String(err?.message).slice(0, 160)}`);

        // Chave inválida ou sem crédito: nenhum modelo dessa chave vai funcionar.
        if (status === 401 || status === 402 || status === 403) {
          geminiBlocked = true;
          break;
        }
        // Modelo inexistente ou pedido inválido: passa para o próximo modelo.
        if (status === 400 || status === 404) break;
        // Limite de uso ou instabilidade: espera um pouco e tenta de novo uma vez.
        if (attempt === 1) await sleep(800);
      }
    }
  }

  if (!preferFallback) {
    try {
      const text = await viaFallbackProvider(p);
      if (text) return { text, model: process.env.FALLBACK_AI_MODEL!, tokensUsed: undefined };
    } catch (err: any) {
      console.error(`[IA] provedor reserva falhou: ${err?.message}`);
      lastError = err;
    }
  }

  console.error(`[IA] todas as opções falharam. Último erro: ${String(lastError?.message).slice(0, 200)}`);
  throw new AIUnavailableError();
}

export const AI_UNAVAILABLE_MESSAGE =
  "Nossos assistentes de IA estão indisponíveis agora. Tente de novo em alguns minutos. Se o problema continuar, fale com o suporte.";
