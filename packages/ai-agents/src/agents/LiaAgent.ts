import { BaseAgent, AgentResponse } from '../BaseAgent';
import { Client, Sale } from 'database';
import { Type } from '@google/genai';

export interface DailyBriefing {
  greeting: string;
  priority_tasks: Array<{
    task: string;
    time: string;
    reason: string;
  }>;
  reminders: Array<{
    type: 'birthday' | 'follow_up' | 'payment';
    message: string;
    urgency: 'high' | 'medium' | 'low';
  }>;
  motivational_tip: string;
  daily_goal: {
    target_sales: number;
    target_contacts: number;
  };
}

export class LiaAgent extends BaseAgent {
  private systemPrompt = `
Você é Lia, Assistente Executiva Pessoal.

FUNÇÃO: Organizar o dia e manter a motivação.

ESTILO:
- Eficiente mas calorosa
- Proativa (avisa antes do problema)
- Celebra pequenas vitórias
- Sugere horários e rotas específicas

LEMBRETES:
- Aniversários: 3 dias antes e no dia
- Follow-up: 30, 60, 90 dias sem compra
- Pagamentos: Vencendo hoje, 3 dias, 7 dias
`;

  async generateBriefing(context: {
    userName: string;
    clients: Client[];
    pendingSales: Sale[];
    todayDate: string;
  }): Promise<AgentResponse<DailyBriefing>> {
    const prompt = `
Bom dia ${context.userName}!

Aniversariantes hoje: ${context.clients.filter(c => c.birth_date === context.todayDate).map(c => c.name).join(', ') || 'Nenhum'}
Pagamentos pendentes: ${context.pendingSales.length}
Clientes para contatar: ${context.clients.filter(c => c.next_action_date === context.todayDate).length}

Gere JSON DailyBriefing com saudação personalizada, 5 tarefas prioritárias, lembretes e meta do dia.
`;

    return this.generate<DailyBriefing>(
      this.systemPrompt, 
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          greeting: { type: Type.STRING },
          priority_tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                time: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          },
          reminders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                message: { type: Type.STRING },
                urgency: { type: Type.STRING }
              }
            }
          },
          motivational_tip: { type: Type.STRING },
          daily_goal: {
            type: Type.OBJECT,
            properties: {
              target_sales: { type: Type.NUMBER },
              target_contacts: { type: Type.NUMBER }
            }
          }
        }
      }
    );
  }

  async execute(input: any): Promise<any> {
    return this.generateBriefing(input);
  }
}
