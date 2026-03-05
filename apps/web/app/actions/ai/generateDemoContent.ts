'use server'

import { createClient } from '@/lib/supabase/server'

// Mapeamento dos agentes reais do pacote
// import { generateContent } from '@repo/ai-agents/clara'
// import { analyzePricing } from '@repo/ai-agents/finn'
// import { chat } from '@repo/ai-agents/zara'

export async function generateDemoContent(agentId: string, inputData: any) {
    try {
        // Delay simulado de processamento da IA para a demonstração (1.5s a 2.5s)
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        switch (agentId) {
            case 'clara':
                // Simular chamada real para a ClaraAgent via Google Gemini
                return {
                    success: true,
                    data: {
                        hook: `Descubra o segredo por trás do ${inputData.product} que está enlouquecendo minhas clientes! 😱`,
                        script: `Sabe aquele produto que você passa e todo mundo pergunta o que é? É exatamente isso que o ${inputData.product} faz. A textura é incrível e a fixação dura o dia todo. E o melhor? Tem desconto exclusivo no ciclo de hoje!`,
                        caption: `O queridinho chegou! ✨ O ${inputData.product} é perfeito para quem busca qualidade sem complicação. Clica no link da bio e garante o seu antes que acabe!\n\n#Beleza #${inputData.product.replace(/\s+/g, '')} #DonaDaRevenda`,
                    }
                };

            case 'finn':
                const cost = parseFloat(inputData.cost.replace(',', '.'));
                const price = parseFloat(inputData.price.replace(',', '.'));
                const qty = parseInt(inputData.qty);

                const margin = ((price - cost) / price) * 100;
                const totalProfit = (price - cost) * qty;

                return {
                    success: true,
                    data: {
                        margin: margin.toFixed(1),
                        profit: totalProfit.toFixed(2).replace('.', ','),
                        suggestion: margin < 30 ? `Sua margem está em ${margin.toFixed(1)}%. O ideal para cosméticos é acima de 30%. Tente aumentar o preço para R$ ${(cost / 0.7).toFixed(2).replace('.', ',')} se a concorrência permitir.` : `Ótima margem! Foque em aumentar o volume de vendas oferecendo kits.`,
                        projection: (totalProfit * 12).toFixed(2).replace('.', ',')
                    }
                };

            case 'zara':
                return {
                    success: true,
                    data: {
                        reply: `Que ótimo! Temos várias opções fantásticas de ${inputData.message.toLowerCase().includes('hidratante') ? 'hidratantes' : 'produtos'} hoje. O Hidratante Ekos está com 20% de desconto. Quer que eu separe um para você? 🛍️`
                    }
                };

            case 'nina':
                return {
                    success: true,
                    data: {
                        alerts: [
                            { product: 'Hidratante Ekos', daysLeft: 5, action: 'Repor' },
                            { product: 'Perfume Far Away', daysLeft: 2, action: 'Urgente' }
                        ],
                        recommendation: "Compre 5 unidades de Ekos e 3 de Far Away para garantir o estoque do mês sem comprometer o caixa."
                    }
                };

            case 'lia':
                return {
                    success: true,
                    data: {
                        tasks: [
                            { time: "09:00", title: "☀️ Bom dia! Você tem 3 entregas hoje" },
                            { time: "10:30", title: "🎂 Aniversário da cliente Maria - enviar mensagem" },
                            { time: "14:00", title: "📦 Repor estoque: Hidratante está acabando" },
                            { time: "16:00", title: "💰 Cobrança: João tem pagamento atrasado há 3 dias" }
                        ]
                    }
                };

            default:
                return { error: 'Agente não encontrado' };
        }
    } catch (error) {
        console.error(`Erro no Agente Demo [${agentId}]:`, error);
        return { error: 'Ocorreu um erro ao processar a IA. Tente novamente.' };
    }
}
