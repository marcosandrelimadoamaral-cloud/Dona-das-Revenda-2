"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from "next/cache"

export async function updateExchangeStatus(id: string, status: string) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: "Não autorizado" }
        }

        const { error } = await supabase
            .from("exchanges")
            .update({ status })
            .eq("id", id)
            .eq("user_id", user.id)

        if (error) {
            console.error("Error updating exchange:", error)
            return { error: error.message }
        }

        revalidatePath("/dashboard/exchanges")
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
