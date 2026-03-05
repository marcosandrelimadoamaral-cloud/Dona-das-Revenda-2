import { BaseAgent, AgentResponse } from '../BaseAgent';
import { UserProduct } from 'database';
import { Type } from '@google/genai';

export interface StockAnalysis {
  stock_health_score: number;
  urgent_actions: Array<{
    product_id: string;
    action: 'repurchase' | 'promote' | 'discard';
    deadline: string;
    reason: string;
  }>;
  forecast_30_days: Array<{
    product_id: string;
    predicted_stockout_date: string;
    confidence: number;
  }>;
  capital_optimization: {
    dead_stock_value: number;
    recommendation: string;
  };
}

export class NinaAgent extends BaseAgent {
  private systemPrompt = `
Você monitora o estoque.
DADOS DO ESTOQUE: {{CONTEXTO_DADOS}}

REGRAS:
- Liste em tópicos o que precisa ser comprado urgente e o que precisa de promoção para sair. 
- Não use frases de enchimento. Seja extremamente direta.
- Aponte os níveis críticos de giro baseado nos dados injetados.
`;

  async analyzeStock(products: UserProduct[]): Promise<AgentResponse<StockAnalysis>> {
    const prompt = `
Análise de estoque para ${products.length} produtos.

Produtos: ${products.map(p => `
- ${p.custom_name}: ${p.current_stock} unidades, validade ${p.expiration_date || 'N/A'}, última venda ${p.last_sale_at || 'Nunca'}
`).join('')}

Forneça StockAnalysis completo em JSON.
`;

    return this.generate<StockAnalysis>(
      this.systemPrompt,
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          stock_health_score: { type: Type.NUMBER },
          urgent_actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                product_id: { type: Type.STRING },
                action: { type: Type.STRING },
                deadline: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          },
          forecast_30_days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                product_id: { type: Type.STRING },
                predicted_stockout_date: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              }
            }
          },
          capital_optimization: {
            type: Type.OBJECT,
            properties: {
              dead_stock_value: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          }
        }
      }
    );
  }

  async execute(input: any): Promise<any> {
    return this.analyzeStock(input);
  }
}
