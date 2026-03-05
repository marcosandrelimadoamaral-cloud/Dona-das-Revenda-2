import { BaseAgent, AgentResponse } from '../BaseAgent';
import { Client, UserProduct } from 'database';
import { Type } from '@google/genai';

export interface WhatsAppMessage {
  message_type: 'first_contact' | 'follow_up' | 'recovery' | 'closing';
  messages: Array<{
    delay_after: number;
    text: string;
    typing_time: number;
  }>;
  next_action: 'wait_reply' | 'call' | 'send_catalog';
  risk_flags: string[];
  confidence: number;
}

export class ZaraAgent extends BaseAgent {
  private systemPrompt = `
Você é a Zara. Sua função é escrever mensagens de WhatsApp ou simular clientes.
DADOS DA LOJA E CLIENTES: {{CONTEXTO_DADOS}}

MODO 1: SE O USUÁRIO PEDIR AJUDA PARA RESPONDER
- Não explique a técnica de vendas. Apenas escreva a mensagem pronta para copiar e colar.
- Use linguagem natural de WhatsApp (curta, quebras de linha, emojis moderados).
- Não use jargões corporativos.

MODO 2: SE O USUÁRIO PEDIR SIMULAÇÃO (TREINO)
- Você É A CLIENTE. Não aja como treinadora.
- Não dê feedback no meio da conversa.
- Se a usuária mandou algo ruim, seja uma cliente chata/seca.
- Mande mensagens curtas: 'Tá caro', 'Vou ver com meu marido', 'Tem desconto?'.
- Nunca mande textos longos. Aja como uma brasileira média no WhatsApp.
`;

  async generateMessage(context: {
    client: Client;
    productsInStock: UserProduct[];
    lastMessage?: string;
    pendingPayment?: boolean;
  }): Promise<AgentResponse<WhatsAppMessage>> {
    const prompt = `
Cliente: ${context.client.name}
Segmento: ${context.client.client_segment}
Tipo de pele: ${context.client.skin_type || 'Não informado'}
Produtos disponíveis: ${context.productsInStock.map(p => p.custom_name).join(', ')}
${context.pendingPayment ? 'ALERTA: Cliente tem pagamento pendente' : ''}
${context.lastMessage ? `Última mensagem do cliente: "${context.lastMessage}"` : 'Iniciar conversa'}

Gere JSON WhatsAppMessage.
`;

    return this.generate<WhatsAppMessage>(
      this.systemPrompt,
      prompt,
      {
        type: Type.OBJECT,
        properties: {
          message_type: { type: Type.STRING },
          messages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                delay_after: { type: Type.NUMBER },
                text: { type: Type.STRING },
                typing_time: { type: Type.NUMBER }
              }
            }
          },
          next_action: { type: Type.STRING },
          risk_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidence: { type: Type.NUMBER }
        }
      }
    );
  }

  async execute(input: any): Promise<any> {
    return this.generateMessage(input);
  }
}
