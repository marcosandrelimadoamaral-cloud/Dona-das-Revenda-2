import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import {
  APPMAX_PLANS,
  AppmaxError,
  appmaxConfigured,
  createCustomer,
  createOrder,
  isPlanId,
  isValidCpf,
  onlyDigits,
  payWithCard,
  payWithPix,
} from "@/lib/appmax"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status })

export async function POST(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !user.email) return fail("Entre na sua conta para assinar.", 401)

  if (!appmaxConfigured()) return fail("O pagamento ainda está sendo ativado. Tente novamente em instantes.", 503)

  let body: any
  try {
    body = await req.json()
  } catch {
    return fail("Requisição inválida.")
  }

  const { plan, method } = body ?? {}
  if (!isPlanId(plan)) return fail("Plano inválido.")
  if (method !== "pix" && method !== "card") return fail("Forma de pagamento inválida.")

  const name = String(body.name ?? "").trim()
  const cpf = onlyDigits(String(body.cpf ?? ""))
  const phone = onlyDigits(String(body.phone ?? ""))

  if (name.length < 3) return fail("Informe seu nome completo.")
  if (!isValidCpf(cpf)) return fail("CPF inválido.")
  if (phone.length < 10 || phone.length > 11) return fail("Informe um celular com DDD.")

  const card = body.card ?? {}
  if (method === "card") {
    const number = onlyDigits(String(card.number ?? ""))
    if (number.length < 13 || number.length > 19) return fail("Número do cartão inválido.")
    if (onlyDigits(String(card.cvv ?? "")).length < 3) return fail("Código de segurança inválido.")
    const month = Number(card.expMonth)
    if (!(month >= 1 && month <= 12) || onlyDigits(String(card.expYear ?? "")).length < 2) return fail("Validade inválida.")
    if (String(card.holderName ?? "").trim().length < 3) return fail("Informe o nome impresso no cartão.")
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined

  try {
    const customerId = await createCustomer({ name, email: user.email, phone, cpf, ip })
    const orderId = await createOrder(customerId, plan)
    const p = APPMAX_PLANS[plan]

    const record = {
      user_id: user.id,
      provider: "appmax",
      plan,
      method,
      amount_cents: p.cents,
      appmax_customer_id: customerId,
      appmax_order_id: orderId,
    }

    if (method === "pix") {
      const pix = await payWithPix(orderId, plan, cpf)
      await supabaseAdmin.from("payment_orders").insert({ ...record, status: "pendente", pix_emv: pix.emv })
      return NextResponse.json({ ok: true, method: "pix", orderId, pix })
    }

    const result = await payWithCard(orderId, customerId, plan, {
      number: String(card.number),
      cvv: String(card.cvv),
      expMonth: String(card.expMonth),
      expYear: String(card.expYear),
      holderName: String(card.holderName),
      holderCpf: String(card.holderCpf || cpf),
    })

    await supabaseAdmin
      .from("payment_orders")
      .insert({ ...record, status: result.approved ? result.status || "autorizado" : "cancelado" })

    if (!result.approved) {
      return fail("Cartão recusado. Confira os dados ou tente outro cartão ou o Pix.")
    }
    // A liberação do acesso acontece pelo webhook, depois que a Appmax confirma o pagamento.
    return NextResponse.json({ ok: true, method: "card", orderId, status: result.status })
  } catch (err) {
    if (err instanceof AppmaxError) return fail(err.message, err.status)
    console.error("[checkout/appmax] erro inesperado")
    return fail("Não foi possível processar o pagamento agora.", 500)
  }
}
