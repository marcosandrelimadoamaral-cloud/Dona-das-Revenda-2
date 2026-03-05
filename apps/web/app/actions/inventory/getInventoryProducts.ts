'use server'

import { createClient } from "@/lib/supabase/server"

export async function getInventoryProducts() {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { error: 'Usuário não autenticado', data: null }
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        return { data, error: null }
    } catch (error: any) {
        console.error("Erro ao buscar estoque:", error)
        return { error: error.message || "Erro desconhecido ao carregar estoque", data: null }
    }
}
