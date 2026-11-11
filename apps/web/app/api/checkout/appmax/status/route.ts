import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// Consultado pela tela de checkout enquanto a pessoa paga o Pix ou espera a confirmação do cartão.
export async function GET(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const orderId = Number(new URL(req.url).searchParams.get("order"))
  if (!orderId) return NextResponse.json({ error: "missing order" }, { status: 400 })

  const { data } = await supabase
    .from("payment_orders")
    .select("status")
    .eq("user_id", user.id)
    .eq("appmax_order_id", orderId)
    .maybeSingle()

  const status = data?.status ?? "pendente"
  return NextResponse.json({ status, paid: status === "aprovado" || status === "integrado" })
}
