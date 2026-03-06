import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
// import { MercadoPagoConfig, Payment } from "mercadopago"

// Note: Mercado Pago Webhooks usually send IPN (Instant Payment Notification) or Data Updates via query paras or body.
// We configure it to receive { action, data: { id } }

export async function POST(req: Request) {
    try {
        const url = new URL(req.url)
        const topic = url.searchParams.get('topic') || url.searchParams.get('type')
        const id = url.searchParams.get('data.id') || url.searchParams.get('id')

        const body = await req.json().catch(() => ({}))
        const paymentId = body?.data?.id || id

        console.log("Mercado Pago Webhook Received:", { paymentId, type: body?.type, action: body?.action })

        // A full implementation requires fetching the payment details to get 'external_reference' and 'status'.
        // For standard MP logic, we simulate getting the payment status since the SDK requires the raw token.
        // Assuming we fetched it and the status is 'approved' and external_reference = userId

        if ((body?.action === 'payment.created' || body?.type === 'payment') && paymentId) {

            // To be robust, one would use: `new Payment(client).get({ id: paymentId })`
            // and then: if (payment.status === 'approved') updateDB(payment.external_reference)

            // For the purpose of the current implementation, we need the external_reference.
            // Since we can't fully mock the exact API response without a valid ID, let's implement the skeleton
            // and assume we extract external_reference.

            // Note: Replace this with the actual SDK call in production.
            const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
            if (accessToken && paymentId) {
                const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                const paymentData = await paymentRes.json()

                if (paymentData.status === 'approved' && paymentData.external_reference) {
                    const userId = paymentData.external_reference

                    // Identify the plan from the preference items
                    let planId = 'monthly'
                    if (paymentData.additional_info?.items && paymentData.additional_info.items.length > 0) {
                        planId = paymentData.additional_info.items[0].id || 'monthly'
                    }

                    const endDate = new Date()
                    if (planId === 'annual') {
                        endDate.setDate(endDate.getDate() + 365)
                    } else if (planId === 'quarterly') {
                        endDate.setDate(endDate.getDate() + 90)
                    } else {
                        endDate.setDate(endDate.getDate() + 30) // Default monthly
                    }

                    console.log(`Setting User ${userId} active via Mercado Pago for plan ${planId}`)

                    const { error: dbError } = await supabaseAdmin
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            status: 'active',
                            stripe_price_id: `mercadopago_${planId}`,
                            stripe_customer_id: `mp_${userId}`,
                            stripe_subscription_id: `mp_sub_${paymentId}`,
                            current_period_end: endDate.toISOString(),
                            cancel_at_period_end: false,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id' })

                    if (dbError) {
                        console.error("Supabase Admin Update Error:", dbError)
                        return NextResponse.json({ error: "DB Error" }, { status: 500 })
                    }
                }
            }
        }

        return NextResponse.json({ received: true })

    } catch (err: any) {
        console.error("Mercado Pago Webhook Error:", err.message)
        return NextResponse.json({ error: "Webhook Error" }, { status: 400 })
    }
}
