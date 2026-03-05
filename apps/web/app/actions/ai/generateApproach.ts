'use server';

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';

export async function generateApproach(
    clientName: string,
    status: string,
    totalSpent: number
) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let userContextRule = "";
        let storeName = "a loja";
        let userName = "a vendedora";

        if (user) {
            const { data: aiConfig } = await supabase
                .from('ai_agents_config')
                .select('*')
                .eq('user_id', user.id)
                .eq('agent_type', 'nina')
                .maybeSingle();

            if (aiConfig) {
                const settings = aiConfig.settings || {};
                storeName = settings.store_name || storeName;
                userName = settings.user_name || userName;

                const customPrompts = aiConfig.custom_prompts || {};
                if (customPrompts.user_context) {
                    userContextRule = `[REGRAS DE PERSONALIZAÇÃO DA USUÁRIA]: Siga estritamente esta persona, tom e estilo definidos: ${customPrompts.user_context}`;
                }
            }
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(totalSpent);

        const prompt = `Você é a Clara, especialista em vendas atuando em nome de ${userName} da loja ${storeName}. Com base no cliente ${clientName} que é ${status} e gastou um total de ${formattedValue} na loja, escreva uma mensagem curta e persuasiva de WhatsApp (fale diretamente com o cliente). Se for VIP, agradeça a fidelidade. Se for Inativo, ofereça um cupom de 10% de desconto. Não inclua placeholders como [Seu Nome].
        
${userContextRule}
`;

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
