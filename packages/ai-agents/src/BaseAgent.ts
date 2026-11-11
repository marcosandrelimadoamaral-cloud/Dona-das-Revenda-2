import { GoogleGenAI, Schema } from "@google/genai";
import { generateWithFallback } from "./generate";

export interface AgentConfig {
  apiKey: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AgentResponse<T> {
  data: T;
  rawText: string;
  tokensUsed?: number;
  confidence: number;
}

export abstract class BaseAgent {
  protected ai: GoogleGenAI;
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.config = config;
  }

  protected async generate<T>(
    systemInstruction: string, 
    prompt: string,
    responseSchema?: Schema,
    context?: Record<string, any>
  ): Promise<AgentResponse<T>> {
    const enrichedPrompt = context 
      ? `${prompt}\n\nContexto: ${JSON.stringify(context, null, 2)}`
      : prompt;

    const { text: responseText, tokensUsed } = await generateWithFallback(this.ai, {
      model: process.env.GEMINI_MODEL || "gemini-3.1-pro-preview",
      contents: enrichedPrompt,
      systemInstruction,
      temperature: this.config.temperature ?? 0.7,
      json: true,
      responseSchema,
    });

    let data: T;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { rawResponse: responseText } as unknown as T;
    }

    return {
      data,
      rawText: responseText,
      confidence: this.calculateConfidence(responseText),
      tokensUsed,
    };
  }

  private calculateConfidence(text: string): number {
    const hasStructure = text.includes('{') && text.includes('}');
    const length = text.length;
    let score = 0.7;
    if (hasStructure) score += 0.2;
    if (length > 100) score += 0.1;
    return Math.min(score, 1.0);
  }

  abstract execute(input: any, context?: any): Promise<any>;
}
