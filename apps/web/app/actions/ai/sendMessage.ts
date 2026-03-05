'use server'

import { createClient } from '@/lib/supabase/server'
import { getAI } from 'ai-agents'

export async function sendMessage(agentId: string, message: string, contextProduct?: any) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado' }

    // Configuração base de Personalização
    const { data: aiConfig } = await supabase
        .from('ai_agents_config')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_type', 'nina')
        .maybeSingle()

    const settings = aiConfig?.settings || {}
    const userName = settings.user_name || "Dona(o) da Revenda"
    const storeName = settings.store_name || "sua loja"
    const targetAudience = settings.target_audience || "seu público"

    const customPrompts = aiConfig?.custom_prompts || {}
    const userContextRule = customPrompts.user_context
        ? `\n\n[REGRAS DE PERSONALIZAÇÃO DEFINIDAS PELA USUÁRIA]\nAja sempre com essas características: ${customPrompts.user_context}`
        : ""

    const ai = getAI()
    let responseText = ""

    // Contexto Temporal Global
    const tzOptions = { timeZone: 'America/Sao_Paulo' }
    const currentDate = new Date().toLocaleString('pt-BR', { ...tzOptions, dateStyle: 'full', timeStyle: 'short' })
    const temporalContext = `\n[CONTEXTO TEMPORAL: Hoje é ${currentDate}]`

    try {
        switch (agentId) {
            case 'clara': {
                // Clara precisa de ideias criativas, vamos dar a ela os produtos
                const { data: userProducts } = await supabase.from('user_products').select('custom_name, category, sale_price, description').eq('user_id', user.id).limit(20)
                const catalogSnippet = userProducts?.map(p => `- ${p.custom_name} (${p.category || 'Sem cat'}): R$ ${p.sale_price}`).join('\n') || "Sem produtos cadastrados."

                const claraPrompt = `
Mensagem da usuária (${userName}): "${message}"${temporalContext}

[DADOS INJETADOS - INFORMAÇÕES DA LOJA E PRODUTOS]
Nome da Loja: ${storeName}
Público-Alvo: ${targetAudience}
Produto Mencionando Específico: ${contextProduct ? JSON.stringify(contextProduct) : "Nenhum no momento."}
Catálogo Resumido (Alguns produtos disponíveis na loja para inspirar posts):
${catalogSnippet}
`
                const resClara = await (ai.clara as any).ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: claraPrompt,
                    config: {
                        systemInstruction: `Role: Especialista em Marketing Digital e Social Media para Revendedoras.
Objective: Criar roteiros de Reels, legendas de posts, ideias de carrosséis e artes criativas que gerem engajamento e desejo de compra.
Details/Context: Use um tom de voz entusiasmado, criativo e moderno. Foque em tendências do Instagram. As sugestões devem ser práticas para quem tem pouco tempo. A loja se chama ${storeName} e a dona é ${userName}.
Structure: Use Negrito para destacar ganchos (hooks) e listas de tópicos para roteiros.${userContextRule}`,
                        temperature: 0.8
                    }
                })
                responseText = resClara.text
                break
            }

            case 'finn': {
                // Cálculo Financeiro Real
                const { data: sales } = await supabase.from('sales').select('total_revenue, total_cost, status').eq('user_id', user.id)

                const totalRecebido = sales?.filter(s => s.status === 'paid').reduce((acc, curr) => acc + Number(curr.total_revenue || 0), 0) || 0
                const custoTotalPago = sales?.filter(s => s.status === 'paid').reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0) || 0
                const fiadoNaRua = sales?.filter(s => s.status === 'pending').reduce((acc, curr) => acc + Number(curr.total_revenue || 0), 0) || 0

                const lucroLiquido = totalRecebido - custoTotalPago
                const margemTotal = totalRecebido > 0 ? ((lucroLiquido / totalRecebido) * 100).toFixed(1) : "0"

                const finnPrompt = `
Mensagem da usuária (${userName}): "${message}"${temporalContext}

[DADOS INJETADOS - PAINEL FINANCEIRO EM TEMPO REAL]
- Faturamento Total (Pago): R$ ${totalRecebido.toFixed(2)}
- Custo das Mercadorias Vendidas (apenas os pagos): R$ ${custoTotalPago.toFixed(2)}
- Lucro Líquido Real: R$ ${lucroLiquido.toFixed(2)}
- Margem de Lucro Global: ${margemTotal}%
- Capital 'Na Rua' (Fiados Pendentes a receber): R$ ${fiadoNaRua.toFixed(2)}
- Produto de interesse momentâneo: ${contextProduct ? contextProduct.custom_name : "Nenhum"}
`
                const resFinn = await (ai.finn as any).ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: finnPrompt,
                    config: {
                        systemInstruction: `Role: Diretor Financeiro (CFO) analítico e estratégico.
Objective: Analisar dados de vendas, sugerir precificação, calcular margem de lucro e dar insights sobre a saúde financeira do negócio gerido por ${userName}.
Details/Context: Tom de voz profissional, sério e direto. Você tem acesso aos dados da plataforma injetados no prompt. Sempre priorize o lucro e o fluxo de caixa. Pode dar puxões de orelha amigáveis sobre o excesso de fiado se necessário. Evite termos técnicos complexos sem explicação. Sem rodeios.
Structure: Respostas em formato de "Insight do CFO" (curto) ou tabelas simples. Vá direto aos números.${userContextRule}`,
                        temperature: 0.3
                    }
                })
                responseText = resFinn.text
                break
            }

            case 'zara': {
                // Clientes e Vendas (CRM)
                const { data: clients } = await supabase.from('clients').select('*').eq('user_id', user.id).limit(10)
                const clientList = clients?.map(c => `- ${c.name} (Gasto Total: R$ ${c.total_spent || 0}) VIP: ${c.client_segment === 'vip' ? 'Sim' : 'Não'}`).join('\n') || "Sem clientes."

                const zaraPrompt = `
Mensagem da usuária (${userName}): "${message}"${temporalContext}

[DADOS INJETADOS - CRM E VENDAS]
Loja: ${storeName}
Alguns de seus clientes cadastrados:
${clientList}
Produto Mencionando Específico: ${contextProduct ? JSON.stringify(contextProduct) : "Nenhum no momento."}
`
                const resZara = await (ai.zara as any).ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: zaraPrompt,
                    config: {
                        systemInstruction: `Role: Especialista em Conversão, Copywriting e Fechamento.
Objective: Criar scripts de vendas para WhatsApp, técnicas de contorno de objeções, estratégias de remarketing e recuperação de vendas.
Details/Context: Tom de voz persuasivo, motivador e focado em resultados rápidos. Especialista em venda "X1" (um para um). Se o usuário estiver simulando, aja como um cliente brasileiro exigente; se estiver pedindo script, entregue algo que vende de verdade.
Structure: Modelos de mensagens prontos para copiar e colar entre aspas ou blocos de código. Sempre inclua gatilhos mentais onde couber.${userContextRule}`,
                        temperature: 0.7
                    }
                })
                responseText = resZara.text
                break
            }

            case 'nina': {
                // Verifica estoque real
                const { data: stockItems } = await supabase.from('user_products').select('custom_name, current_stock, min_stock_alert, purchase_price').eq('user_id', user.id)

                const criticalStock = stockItems?.filter(item => item.current_stock <= (item.min_stock_alert || 0)) || []
                const deadStockList = stockItems?.filter(item => item.current_stock > 10) || [] // Simplificação para "muito estoque = parado"
                const cashTrapped = stockItems?.reduce((acc, curr) => acc + (curr.purchase_price * curr.current_stock), 0) || 0

                const criticalDesc = criticalStock.map(p => `- ${p.custom_name} (Atual: ${p.current_stock} uni, Mínimo Aceitável: ${p.min_stock_alert})`).join('\n') || "Nenhum produto em falta severa no momento."
                const deadDesc = deadStockList.map(p => `- ${p.custom_name} (Tem ${p.current_stock} parados!)`).join('\n') || "-"

                const ninaPrompt = `
Mensagem da usuária (${userName}): "${message}"${temporalContext}

[DADOS INJETADOS - ESTOQUE REAL]
Capital em Dinheiro Parado nas prateleiras atualmente (Custo da mercadoria x Estoque): R$ ${cashTrapped.toFixed(2)}
PRODUTOS EM ALERTA VERMELHO (Precisa repor urgência):
${criticalDesc}
PRODUTOS COM ALTO ESTOQUE (Risco de dinheiro parado):
${deadDesc}
Contexto: ${contextProduct ? contextProduct.custom_name : "Geral"}
`
                const resNina = await (ai.nina as any).ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: ninaPrompt,
                    config: {
                        systemInstruction: `Role: Consultora de Organização e Logística.
Objective: Auxiliar na organização do estoque gerido por ${userName}, identificar produtos "parados" no inventário que acabaram de ser informados, e sugerir o momento certo de reposição.
Details/Context: Tom de voz pragmático, organizado e lógico. O foco é não deixar dinheiro parado na prateleira. Se há muitos itens no alerta vermelho, demonstre urgência.
Structure: Listas numeradas de prioridades e check-lists de organização diretos ao ponto.${userContextRule}`,
                        temperature: 0.4
                    }
                })
                responseText = resNina.text
                break
            }

            case 'lia': {
                // Agenda e Lembretes Gerais
                const { data: eventsToday } = await supabase
                    .from('appointments')
                    .select('title, type, description')
                    .eq('user_id', user.id)
                    .eq('date', new Date().toISOString().split('T')[0]) // Eventos de hoje

                const eventList = eventsToday?.map(e => `- [${e.type.toUpperCase()}] ${e.title} (${e.description || ''})`).join('\n') || "Nenhum compromisso marcado para hoje."

                const liaPrompt = `
Mensagem da usuária (${userName}): "${message}"${temporalContext}

[DADOS INJETADOS - A ROTINA DE HOJE]
Compromissos e Lembretes marcados para HOJE na agenda do painel:
${eventList}
`
                const resLia = await (ai.lia as any).ai.models.generateContent({
                    model: "gemini-3.1-pro-preview",
                    contents: liaPrompt,
                    config: {
                        systemInstruction: `Role: Assistente Pessoal e "Segunda Mente" da Revendedora (${userName}).
Objective: Organizar a agenda, priorizar tarefas do dia embasada nos eventos informados, resumir informações e dar suporte em qualquer dúvida geral na plataforma.
Details/Context: Tom de voz prestativo, empático e extremamente eficiente. Ela é o braço direito da usuária. Aconselhe a melhor forma de organizar o tempo.
Structure: Bullet points rápidos e resumos executivos (máximo 3 parágrafos). Sempre inicie com uma saudação calorosa e motivacional, mas vá rápido para as tarefas.${userContextRule}`,
                        temperature: 0.5
                    }
                })
                responseText = resLia.text
                break
            }

            default:
                responseText = "Agente não reconhecido."
        }

        return { response: responseText }

    } catch (err: any) {
        console.error("Erro no Agente:", err)
        return { error: 'Ocorreu um erro ao consultar o modelo Gemini. Confirme se a API Key do Google GenAI está válida e configurada.' }
    }
}
