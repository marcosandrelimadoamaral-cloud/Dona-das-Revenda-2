"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeOnboarding(data: {
    fullName: string,
    whatsapp: string,
    brands: string[]
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: "Not authenticated" }
    }

    // Sanitize WhatsApp number (keep only digits)
    const cleanWhatsapp = data.whatsapp.replace(/\D/g, "")

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: data.fullName,
            whatsapp_number: cleanWhatsapp,
            brands_sold: data.brands,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error("Onboarding Save Error:", error)
        return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
