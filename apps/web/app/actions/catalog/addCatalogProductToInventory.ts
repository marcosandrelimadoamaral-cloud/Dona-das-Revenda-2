'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCatalogProductToInventory(catalogProductId: string) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado')
        }

        // 1. Fetch the exact product details from catalog
        const { data: catalogItem, error: catalogError } = await supabase
            .from('catalog_products')
            .select('*')
            .eq('id', catalogProductId)
            .single()

        if (catalogError || !catalogItem) {
            console.error('[addCatalogProductToInventory] Erro ao buscar produto catálogo:', catalogError)
            throw new Error('Produto original do catálogo não foi encontrado.')
        }

        // 2. Insert as a raw product into user_products table
        const { error: insertError } = await supabase
            .from('user_products')
            .insert([{
                user_id: user.id,
                name: catalogItem.name,
                brand: catalogItem.brand_display,
                line: catalogItem.line,
                category: catalogItem.category,
                purchase_price: catalogItem.base_price, // Assuming cost goes here
                sell_price: catalogItem.suggested_price, // Assumindo sugg goes to selling
                stock_quantity: 0, // Inicia zerado, aguardando pedido/chegada
                status: 'active'
            }])

        if (insertError) {
            console.error('[addCatalogProductToInventory] Erro ao salvar produto do usuário:', insertError)
            throw new Error('Erro ao salvar no seu estoque.')
        }

        revalidatePath('/inventory')
        return { success: true }

    } catch (e: any) {
        return { success: false, error: e.message }
    }
}
