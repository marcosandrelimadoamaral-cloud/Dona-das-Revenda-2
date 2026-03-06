"use server"

import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function createMPPreference(planType: 'monthly' | 'quarterly' | 'annual') {
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
        let isAnnual = false

        switch (planType) {
            case 'monthly':
                value = 97.00
                description = "Assinatura O Cauteloso - 30 Dias"
                break
            case 'quarterly':
                value = 261.00
                description = "Assinatura O Equilíbrio - 90 Dias"
                break
            case 'annual':
                value = 570.00
                description = "Assinatura VIP Anual - 365 Dias"
                isAnnual = true
                break
            default:
                return { success: false, error: "Plano inválido." }
        }

        // Configure Mercado Pago SDK
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' })
        const preference = new Preference(client)

        const preferenceData = await preference.create({
            body: {
                items: [
                    {
                        id: planType,
                        title: `${description} #${Date.now()}`,
                        quantity: 1,
                        unit_price: value,
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    email: email,
                    name: name
                },
                // VITAL: append timestamp to external_reference and title to force MP to bypass its cache 
                // and fetch the newly saved 'Vendedor Sem Juros' settings from the dashboard.
                external_reference: `${user.id}_${Date.now()}`,
                statement_descriptor: "DONA REVENDA",
                payment_methods: {
                    // Excluindo apenas caixa eletrônico
                    excluded_payment_types: [
                        { id: 'atm' },
                    ]
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL || 'https://donadarevenda.com.br'}/billing?success=true`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL || 'https://donadarevenda.com.br'}/billing?canceled=true`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://donadarevenda.com.br'}/billing?pending=true`
                },
                auto_return: 'approved'
            }
        })

        if (!preferenceData.id) {
            return { success: false, error: "Falha ao gerar identificador de pagamento." }
        }

        return { success: true, init_point: preferenceData.init_point }
    } catch (error: any) {
        console.error("Erro no createMPPreference:", error)
        return { success: false, error: error.message || "Erro interno ao criar preferência do Mercado Pago." }
    }
}
