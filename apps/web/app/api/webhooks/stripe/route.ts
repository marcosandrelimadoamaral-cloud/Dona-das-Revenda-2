import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Required: Disable body parsing so we can verify the raw Stripe signature
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const bodyText = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('[Stripe Webhook] Missing stripe-signature header')
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET env var')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret)
    } catch (err: any) {
      console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    console.log(`[Stripe Webhook] Event received: ${event.type}`)

    switch (event.type) {

      // ──────────────────────────────────────────────────────────────
      // 1. Customer completes Checkout Session → activate subscription
      // ──────────────────────────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.client_reference_id
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId) {
          console.error('[Stripe Webhook] checkout.session.completed — missing client_reference_id')
          break
        }

        // Fetch full subscription details
        const sub = await stripe.subscriptions.retrieve(subscriptionId) as any
        const priceId = sub.items?.data[0]?.price?.id ?? ''
        const periodEnd = new Date(sub.current_period_end * 1000).toISOString()

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            current_period_end: periodEnd,
          }, { onConflict: 'user_id' })

        if (error) {
          console.error('[Stripe Webhook] DB error on checkout.session.completed:', error)
        } else {
          console.log(`[Stripe Webhook] ✅ Subscription ACTIVATED for user: ${userId}`)
        }
        break
      }

      // ──────────────────────────────────────────────────────────────
      // 2. Invoice successfully paid → keep subscription active
      //    (fires on every recurring billing cycle renewal)
      // ──────────────────────────────────────────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as any  // 'any' needed for SDK type version mismatch
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        const sub = await stripe.subscriptions.retrieve(subscriptionId) as any
        const periodEnd = new Date(sub.current_period_end * 1000).toISOString()

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: periodEnd,
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (error) {
          console.error('[Stripe Webhook] DB error on invoice.paid:', error)
        } else {
          console.log(`[Stripe Webhook] ✅ Invoice PAID — subscription renewed: ${subscriptionId}`)
        }
        break
      }

      // ──────────────────────────────────────────────────────────────
      // 3. Invoice payment failed → mark as past_due
      //    Notify the customer to update payment method
      // ──────────────────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any  // 'any' needed for SDK type version mismatch
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId)

        if (error) {
          console.error('[Stripe Webhook] DB error on invoice.payment_failed:', error)
        } else {
          console.log(`[Stripe Webhook] ⚠️ Invoice payment FAILED — subscription past_due: ${subscriptionId}`)
        }
        break
      }

      // ──────────────────────────────────────────────────────────────
      // 4. Subscription updated (plan change, renewal, etc.)
      // ──────────────────────────────────────────────────────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as any  // 'any' needed for SDK type version mismatch
        const periodEnd = new Date(sub.current_period_end * 1000).toISOString()

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_end: periodEnd,
            stripe_price_id: sub.items.data[0]?.price.id ?? '',
          })
          .eq('stripe_subscription_id', sub.id)

        if (error) {
          console.error('[Stripe Webhook] DB error on customer.subscription.updated:', error)
        } else {
          console.log(`[Stripe Webhook] 🔄 Subscription UPDATED: ${sub.id} → ${sub.status}`)
        }
        break
      }

      // ──────────────────────────────────────────────────────────────
      // 5. Subscription cancelled → revoke access
      // ──────────────────────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', sub.id)

        if (error) {
          console.error('[Stripe Webhook] DB error on customer.subscription.deleted:', error)
        } else {
          console.log(`[Stripe Webhook] ❌ Subscription CANCELLED: ${sub.id}`)
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    // Always return 200 so Stripe doesn't retry successfully processed events
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (err: any) {
    console.error('[Stripe Webhook] Unexpected error:', err.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
