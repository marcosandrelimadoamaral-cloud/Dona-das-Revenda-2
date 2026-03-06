'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

/**
 * Creates or retrieves a Stripe customer for the user,
 * then creates a Subscription in 'default_incomplete' mode
 * to get the clientSecret needed for Stripe Elements.
 */
export async function createSubscriptionIntent(planType: 'monthly' | 'quarterly' | 'annual') {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Usuário não autenticado.' }
        }

        // Get the price ID for the selected plan
        const priceMap: Record<string, string | undefined> = {
            monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_1T76LkEQsqPL4Bjppo4NqiIl',
            quarterly: process.env.STRIPE_PRICE_QUARTERLY || 'price_1T76LjEQsqPL4BjpuGX9gjsR',
            annual: process.env.STRIPE_PRICE_ANNUAL || 'price_1T82Z7EQsqPL4Bjp5qHAJltj',
        }

        const priceId = priceMap[planType]
        if (!priceId) {
            return { success: false, error: 'Plano inválido ou não configurado.' }
        }

        // Look for existing customer ID saved in the profile/subscription table
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single()

        let customerId = subscription?.stripe_customer_id as string | undefined

        // Create Stripe customer if none exists
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_user_id: user.id },
            })
            customerId = customer.id

            // Persist the customer ID right away
            await supabase
                .from('subscriptions')
                .upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: 'user_id' })
        }

        // Create subscription with 'default_incomplete' to enable Elements
        const stripeSubscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: { supabase_user_id: user.id, plan_type: planType },
        })

        const latestInvoice = stripeSubscription.latest_invoice as any
        const paymentIntent = latestInvoice?.payment_intent

        if (!paymentIntent?.client_secret) {
            return { success: false, error: 'Não foi possível iniciar o pagamento. Tente novamente.' }
        }

        return {
            success: true,
            clientSecret: paymentIntent.client_secret as string,
            subscriptionId: stripeSubscription.id,
        }
    } catch (error: any) {
        console.error('createSubscriptionIntent error:', error)
        return { success: false, error: error.message || 'Erro ao conectar com o sistema de pagamento.' }
    }
}
