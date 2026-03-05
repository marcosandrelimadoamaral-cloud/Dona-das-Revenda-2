'use server';

import { GoogleGenAI } from '@google/genai';

export async function generateApproach(
    clientName: string,
    status: string,
    totalSpent: number
) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(totalSpent);

        const prompt = `Você é a Clara, especialista em vendas. Com base no cliente ${clientName} que é ${status} e gastou um total de ${formattedValue} na loja, escreva uma mensagem curta e persuasiva de WhatsApp (fale diretamente com o cliente e pode usar emojis). Se for VIP, agradeça a fidelidade. Se for Inativo, ofereça um cupom de 10% de desconto. Não inclua placeholders como [Seu Nome]. Aja de forma calorosa.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
        });

        return { success: true, message: response.text };
    } catch (error: any) {
        console.error('Error generating approach:', error);
        return { error: 'Falha ao gerar mensagem com IA' };
    }
}
