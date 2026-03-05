"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAppointment(formData: FormData) {
    try {
        const title = formData.get('title') as string
        const date = formData.get('date') as string
        const type = formData.get('type') as string
        const description = formData.get('description') as string

        if (!title || !date || !type) {
            return { success: false, error: "Preencha todos os campos obrigatórios." }
        }

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: "Não autorizado." }
        }

        const { error } = await supabase
            .from('appointments')
            .insert({
                user_id: user.id,
                title,
                date,
                type,
                description: description || null
            })

        if (error) {
            console.error("Erro ao inserir compromisso:", error)
            return { success: false, error: "Falha ao criar compromisso. Tente novamente." }
        }

        revalidatePath('/agenda')
        return { success: true }
    } catch (error: any) {
        console.error("Exceção em createAppointment:", error)
        return { success: false, error: error.message || "Erro interno." }
    }
}
