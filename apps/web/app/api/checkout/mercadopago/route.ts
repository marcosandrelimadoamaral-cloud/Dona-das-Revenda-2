import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@/lib/supabase/server"

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' })

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { planId, price } = body

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "User is required" }, { status: 401 })
        }

        const userId = user.id

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        // Cria a preferência de pagamento (Checkout Pro)
        const preference = new Preference(client)

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: planId,
                        title: `Dona da Revenda - Plano ${planId}`,
                        quantity: 1,
                        unit_price: price || 97.00,
                        currency_id: "BRL"
                    }
                ],
                // Força o checkout a focar no PIX / Boleto se possível ou cartões
                payment_methods: {
                    excluded_payment_types: [
                        { id: "credit_card" },
                        { id: "debit_card" },
                        { id: "ticket" } // Dependendo da versão, ticket é boleto / lotérica. Pra focar só no pix, a documentação real recomenda deixar livre ou focar via checkout brl
                    ],
                    installments: 1
                },
                external_reference: userId,
                back_urls: {
                    success: `${appUrl}/billing?success=true`,
                    failure: `${appUrl}/billing?success=false`,
                    pending: `${appUrl}/billing?pending=true`
                },
                auto_return: "approved",
                statement_descriptor: "DONA DA REVENDA"
            }
        })

        if (!response.init_point) {
            throw new Error("Failed to create preference init_point is missing")
        }

        return NextResponse.json({ url: response.init_point })

    } catch (error: any) {
        console.error("Mercado Pago Checkout Error:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
