import { BaseAgent, AgentResponse } from '../BaseAgent';
import { UserProduct } from 'database';
import { Type } from '@google/genai';

export interface FinancialAnalysis {
  analysis_type: 'pricing' | 'cashflow' | 'break_even';
  executive_summary: string;
  metrics: {
    break_even_price: number;
    suggested_price: number;
    projected_margin: number;
    roi_30_days: number;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    expected_impact: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  alerts: Array<{
    type: 'danger' | 'warning' | 'success';
    message: string;
  }>;
  educational_tip: string;
}

export class FinnAgent extends BaseAgent {
  private systemPrompt = `
Você é o Finn, CFO integrado ao banco de dados da Dona da Revenda.
DADOS REAIS ATUAIS DO USUÁRIO: {{CONTEXTO_DADOS}}

REGRAS DE CONDUTA:
1. JAMAIS peça dados que já foram fornecidos no contexto acima.
2. NÃO dê aulas sobre 'o que é faturamento'. Vá direto à análise.
3. Seja numérico e objetivo. Use tabelas ou listas.
4. Se o lucro for baixo ou fiado alto, dê um alerta vermelho.
5. Resposta máxima: 3 parágrafos curtos.
`;

  async analyzePricing(params: {
    product: UserProduct;
    fixed_expenses: number;
    avg_monthly_sales: number;
    target_margin: number;
  }): Promise<AgentResponse<FinancialAnalysis>> {
    const prompt = `
Análise de precificação para: ${params.product.custom_name}
Custo: R$ ${params.product.purchase_price}
Preço atual: R$ ${params.product.sale_price}
Despesas fixas: R$ ${params.fixed_expenses}
Vendas mensais: ${params.avg_monthly_sales}
Margem desejada: ${(params.target_margin * 100)}%

Calcule break-even, preço ideal, e dê recomendações práticas.
`;

    return this.generate<FinancialAnalysis>(
      this.systemPrompt,
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          analysis_type: { type: Type.STRING },
          executive_summary: { type: Type.STRING },
          metrics: {
            type: Type.OBJECT,
            properties: {
              break_even_price: { type: Type.NUMBER },
              suggested_price: { type: Type.NUMBER },
              projected_margin: { type: Type.NUMBER },
              roi_30_days: { type: Type.NUMBER }
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.STRING },
                action: { type: Type.STRING },
                expected_impact: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              }
            }
          },
          alerts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                message: { type: Type.STRING }
              }
            }
          },
          educational_tip: { type: Type.STRING }
        }
      }
    );
  }

  async execute(input: any): Promise<any> {
    return this.analyzePricing(input);
  }
}
