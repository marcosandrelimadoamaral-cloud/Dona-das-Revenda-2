import { BaseAgent, AgentResponse } from '../BaseAgent';
import { UserProduct, CatalogProduct } from 'database';
import { Type } from '@google/genai';

export interface ReelScript {
  content_type: 'reel' | 'carousel' | 'story' | 'whatsapp';
  hook: {
    text: string;
    duration_sec: number;
    visual: string;
  };
  script: Array<{
    time: string;
    text: string;
    visual_direction: string;
    audio_cue?: string;
  }>;
  captions: string[];
  hashtags: {
    high_reach: string[];
    niche: string[];
    branded: string[];
  };
  cta: string;
  audio_suggestion: {
    name: string;
    trending_reason: string;
  };
  psychological_triggers: string[];
  stock_mentioned: string[];
  confidence_score: number;
}

export class ClaraAgent extends BaseAgent {
  private systemPrompt = `
Você cria conteúdo para redes sociais.
DADOS DO PRODUTO: {{CONTEXTO_DADOS}}

REGRAS OBRIGATÓRIAS:
1. Sem introduções ('Claro! Aqui está uma ideia...'). Entregue o conteúdo direto.
2. Separe claramente: [Legenda], [Story], [Roteiro Reels].
3. Se o produto tem pouco estoque, use gatilhos de escassez urgentes.
4. Texto pronto para copiar.
`;

  async generateContent(request: {
    product: UserProduct & { catalog_products?: CatalogProduct | null };
    objective: 'sales' | 'engagement' | 'education' | 'trend';
    tone: number;
    targetAudience: string;
  }): Promise<AgentResponse<ReelScript>> {
    const prompt = `
Crie um roteiro de Reels para Instagram/TikTok.

PRODUTO: ${request.product.custom_name}
MARCA: ${request.product.catalog_products?.brand || 'Marca Própria'}
PREÇO: R$ ${request.product.sale_price}
ESTOQUE: ${request.product.current_stock} unidades (USE PARA ESCASSEZ REAL)
DESCRIÇÃO: ${request.product.description || request.product.catalog_products?.description || 'Produto de beleza'}

OBJETIVO: ${request.objective}
TOM: ${request.tone}/5
PÚBLICO: ${request.targetAudience}

Gere JSON ReelScript completo.
`;

    return this.generate<ReelScript>(
      this.systemPrompt.replace('{{tone}}', request.tone.toString()),
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          content_type: { type: Type.STRING },
          hook: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              duration_sec: { type: Type.NUMBER },
              visual: { type: Type.STRING }
            }
          },
          script: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                text: { type: Type.STRING },
                visual_direction: { type: Type.STRING },
                audio_cue: { type: Type.STRING }
              }
            }
          },
          captions: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: {
            type: Type.OBJECT,
            properties: {
              high_reach: { type: Type.ARRAY, items: { type: Type.STRING } },
              niche: { type: Type.ARRAY, items: { type: Type.STRING } },
              branded: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          cta: { type: Type.STRING },
          audio_suggestion: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              trending_reason: { type: Type.STRING }
            }
          },
          psychological_triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
          stock_mentioned: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidence_score: { type: Type.NUMBER }
        }
      }
    );
  }

  async execute(input: any): Promise<any> {
    return this.generateContent(input);
  }
}
