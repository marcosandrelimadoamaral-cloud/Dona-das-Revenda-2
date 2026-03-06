"use server"

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function createStripeCheckout(planType: 'monthly' | 'quarterly' | 'annual') {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: "Usuário não autenticado." }
        }

        let priceId = ''
        switch (planType) {
            case 'monthly':
                priceId = process.env.STRIPE_PRICE_MONTHLY || 'price_1T76LkEQsqPL4Bjppo4NqiIl'
                break
            case 'quarterly':
                priceId = process.env.STRIPE_PRICE_QUARTERLY || 'price_1T76LjEQsqPL4BjpuGX9gjsR'
                break
            case 'annual':
                priceId = process.env.STRIPE_PRICE_ANNUAL || 'price_1T82Z7EQsqPL4Bjp5qHAJltj'
                break
            default:
                return { success: false, error: "Plano inválido." }
        }

        if (!priceId) {
            return { success: false, error: "ID do preço não configurado no ambiente." }
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer_email: user.email,
            client_reference_id: user.id, // VITAL for webhook processing
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing?canceled=true`,
        })

        if (!session.url) {
            return { success: false, error: "Falha ao criar sessão do Stripe." }
        }

        return { success: true, url: session.url }
    } catch (error: any) {
        console.error("Erro no createStripeCheckout:", error)
        return { success: false, error: error.message || "Erro interno ao conectar com a operadora." }
    }
}
