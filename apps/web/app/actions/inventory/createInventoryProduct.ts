'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createInventoryProduct(data: {
    name: string
    brand: string
    category: string
    costPrice: number
    salePrice: number
    stockQuantity: number
    minStock: number
}) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Usuário não autenticado' }
        }

        const { error } = await supabase
            .from('products')
            .insert({
                user_id: user.id,
                name: data.name,
                brand: data.brand,
                category: data.category,
                cost_price: data.costPrice,
                sale_price: data.salePrice,
                stock_quantity: data.stockQuantity,
                min_stock: data.minStock
            })

        if (error) throw error

        revalidatePath('/estoque')
        revalidatePath('/dashboard')

        return { success: true, error: null }
    } catch (error: any) {
        console.error("Erro ao criar produto:", error)
        return { success: false, error: error.message || "Erro interno ao cadastrar" }
    }
}

export async function getBrandsSold() {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return []

        const { data } = await supabase.from('profiles').select('brands_sold').eq('id', user.id).single()
        return data?.brands_sold || []
    } catch (error) {
        return []
    }
}
