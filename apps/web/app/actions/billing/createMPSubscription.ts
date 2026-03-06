"use server"

import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, PreApprovalPlan } from 'mercadopago'

export async function createMPSubscription(planType: 'monthly' | 'quarterly' | 'annual') {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: "Usuário não autenticado." }
        }

        const email = user.email
        const name = user.user_metadata?.name || "Cliente"

        let value = 0
        let description = ""
        let frequency = 1
        let frequencyType = 'months'

        switch (planType) {
            case 'monthly':
                value = 97.00
                description = "Assinatura Mensal"
                frequency = 1
                break
            case 'quarterly':
                value = 261.00
                description = "Assinatura Trimestral"
                frequency = 3
                break
            case 'annual':
                value = 570.00
                description = "Assinatura Anual VIP"
                frequency = 12
                break
            default:
                return { success: false, error: "Plano inválido." }
        }

        // Configure Mercado Pago SDK
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' })
        const preApprovalPlan = new PreApprovalPlan(client)

        const planData = await preApprovalPlan.create({
            body: {
                reason: `${description} - Dona da Revenda`,
                auto_recurring: {
                    frequency: frequency,
                    frequency_type: frequencyType,
                    transaction_amount: value,
                    currency_id: 'BRL',
                },
                payment_methods_allowed: {
                    payment_types: [
                        { id: 'credit_card' }
                    ],
                    payment_methods: []
                },
                back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://donadarevenda.com.br'}/billing?success=true`,
            }
        })

        if (!planData.init_point) {
            return { success: false, error: "Falha ao gerar o link de assinatura." }
        }

        return { success: true, init_point: planData.init_point }
    } catch (error: any) {
        console.error("Erro no createMPSubscription:", error)
        return { success: false, error: error.message || "Erro interno ao criar assinatura do Mercado Pago." }
    }
}
