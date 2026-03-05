"use server"

import { createClient } from '@/lib/supabase/server'

export interface ExchangeRecord {
    id: string
    type: string
    product_id?: string
    client_id?: string
    product_name: string
    client_name: string
    reason: string
    status: string
    created_at: string
}

export async function getExchanges() {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { data: null, error: "Não autorizado" }
        }

        const { data, error } = await supabase
            .from("exchanges")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching exchanges:", error)
            return { data: null, error: error.message }
        }

        const exchanges = data.map((item: any) => ({
            ...item,
            client: item.client_name || "Cliente Desconhecido",
            product: item.product_name || "Produto Desconhecido",
            date: new Date(item.created_at).toLocaleDateString("pt-BR")
        }))

        return { data: exchanges as ExchangeRecord[], error: null }
    } catch (error: any) {
        return { data: null, error: error.message }
    }
}
