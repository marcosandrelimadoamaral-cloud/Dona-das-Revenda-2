import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { APPMAX_PLANS, PAID_STATUSES, getOrder, isPlanId } from "@/lib/appmax"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// A Appmax não assina os webhooks. Por isso o evento só serve de aviso: o status real do
// pedido é sempre consultado na API da Appmax antes de liberar qualquer acesso.
// Cadastre a URL no painel com ?token=<APPMAX_WEBHOOK_TOKEN> para barrar chamadas aleatórias.

const NEGATIVE_EVENTS = new Set(["OrderRefund", "OrderChargeBackInTreatment", "order_refund", "order_chargeback_in_treatment"])

const ROW_COLUMNS = "id, user_id, plan, method, amount_cents, appmax_customer_id, status"

function extractIds(payload: any): { orderId: number | null; customerId: number | null } {
  const d = payload?.data ?? {}
  // data.id só é id de pedido quando vem junto com customer_id (senão é evento de cliente).
  const orderId = d.order_id ?? (d.id && d.customer_id ? d.id : null)
  const customerId = d.customer_id ?? d.customer?.id ?? null
  return { orderId: orderId ? Number(orderId) : null, customerId: customerId ? Number(customerId) : null }
}

function addMonths(from: Date, months: number) {
  const d = new Date(from)
  d.setMonth(d.getMonth() + months)
  return d
}

export async function POST(req: Request) {
  const expected = process.env.APPMAX_WEBHOOK_TOKEN
  if (expected && new URL(req.url).searchParams.get("token") !== expected) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const event: string = payload?.event ?? ""
  const { orderId, customerId } = extractIds(payload)

  try {
    // Cancelamento de assinatura: o acesso continua até o fim do período já pago.
    if (event === "SubscriptionCancellationEvent" || event === "subscription_cancelation") {
      console.log(`[Appmax Webhook] cancelamento solicitado (cliente ${payload?.data?.id ?? "?"})`)
      return NextResponse.json({ received: true })
    }

    if (!orderId) return NextResponse.json({ received: true, ignored: event })

    // Fonte da verdade: consulta o pedido na Appmax.
    const order = await getOrder(orderId)

    // Pedido que criamos? Se não, pode ser uma renovação (pedido novo do mesmo cliente).
    let { data: row } = await supabaseAdmin.from("payment_orders").select(ROW_COLUMNS).eq("appmax_order_id", orderId).maybeSingle()

    if (!row) {
      const cid = order.customerId ?? customerId
      if (!cid) return NextResponse.json({ received: true, ignored: "unknown order" })

      const { data: last } = await supabaseAdmin
        .from("payment_orders")
        .select(ROW_COLUMNS)
        .eq("appmax_customer_id", cid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (!last) return NextResponse.json({ received: true, ignored: "unknown customer" })

      const { data: created } = await supabaseAdmin
        .from("payment_orders")
        .insert({
          user_id: last.user_id,
          provider: "appmax",
          plan: last.plan,
          method: last.method,
          amount_cents: last.amount_cents,
          appmax_customer_id: cid,
          appmax_order_id: orderId,
          status: "pendente",
        })
        .select(ROW_COLUMNS)
        .single()
      row = created
    }
    if (!row) return NextResponse.json({ received: true, ignored: "no row" })

    const alreadyPaid = PAID_STATUSES.has(row.status)
    const paidNow = PAID_STATUSES.has(order.status)
    const nowIso = new Date().toISOString()

    await supabaseAdmin
      .from("payment_orders")
      .update({ status: order.status, updated_at: nowIso, ...(paidNow && !alreadyPaid ? { paid_at: nowIso } : {}) })
      .eq("appmax_order_id", orderId)

    if (paidNow && !alreadyPaid && isPlanId(row.plan)) {
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("current_period_end, status")
        .eq("user_id", row.user_id)
        .maybeSingle()

      // Renovação soma ao período que ainda restar; a primeira cobrança conta a partir de hoje.
      const now = new Date()
      const currentEnd = sub?.current_period_end ? new Date(sub.current_period_end) : null
      const base = sub?.status === "active" && currentEnd && currentEnd > now ? currentEnd : now
      const periodEnd = addMonths(base, APPMAX_PLANS[row.plan].months)

      const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert({ user_id: row.user_id, status: "active", current_period_end: periodEnd.toISOString() }, { onConflict: "user_id" })
      if (error) {
        console.error("[Appmax Webhook] erro ao ativar assinatura:", error.message)
        return NextResponse.json({ error: "activation failed" }, { status: 500 })
      }
      console.log(`[Appmax Webhook] assinatura ativada: usuário ${row.user_id}`)
    }

    if (NEGATIVE_EVENTS.has(event) || order.status === "estornado" || order.status.startsWith("chargeback")) {
      await supabaseAdmin.from("subscriptions").update({ status: "canceled" }).eq("user_id", row.user_id)
      console.log(`[Appmax Webhook] acesso suspenso (${order.status}): usuário ${row.user_id}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("[Appmax Webhook] erro:", err?.message)
    // 500 faz a Appmax tentar de novo.
    return NextResponse.json({ error: "processing failed" }, { status: 500 })
  }
}
