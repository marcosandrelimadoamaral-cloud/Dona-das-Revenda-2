"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from "next/cache"

export async function createExchange(formData: FormData) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: "Não autorizado" }
        }

        const type = formData.get("type") as string
        const productId = formData.get("product_id") as string || null
        const clientId = formData.get("client_id") as string || null
        const reason = formData.get("reason") as string

        const productName = formData.get("product_name") as string || "Produto Não Identificado"
        const clientName = formData.get("client_name") as string || "Cliente Não Identificado"

        const { error } = await supabase
            .from("exchanges")
            .insert({
                user_id: user.id,
                type,
                product_id: productId,
                client_id: clientId,
                product_name: productName,
                client_name: clientName,
                reason,
                status: "pending"
            })

        if (error) {
            console.error("Error creating exchange:", error)
            return { error: error.message }
        }

        revalidatePath("/dashboard/exchanges")
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
