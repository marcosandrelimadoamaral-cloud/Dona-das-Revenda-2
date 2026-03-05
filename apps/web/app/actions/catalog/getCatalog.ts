'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCatalog(
    searchQuery: string = '',
    brands: string[] = [],
    categories: string[] = [],
    limit = 100,
    offset = 0
) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado')
        }

        console.log("Buscando produtos com filtros:", { searchQuery, brands, categories })

        let query = supabase.from('catalog_products').select('*', { count: 'exact' })

        // Busca Textual
        if (searchQuery.trim().length > 0) {
            const wildcardSearch = `%${searchQuery.trim()}%`
            query = query.ilike('name', wildcardSearch)
        }

        // Filtros de Array (Marca) - convertendo para minúsculas
        if (brands.length > 0) {
            const lowerBrands = brands.map(b => b.toLowerCase())
            query = query.in('brand', lowerBrands)
        }

        // Filtros de Array (Categorias)
        if (categories.length > 0) {
            query = query.in('category', categories)
        }

        // Paginação simples
        query = query.order('name', { ascending: true })
        query = query.range(offset, offset + limit - 1)

        const { data: products, error, count } = await query

        if (error) {
            console.error('[getCatalog] Erro na query:', error.message)
            throw error
        }

        return {
            success: true,
            products: products || [],
            totalCount: count || 0
        }
    } catch (error: any) {
        console.error('[getCatalog] Erro CRÍTICO:', error)
        return {
            success: false,
            error: error.message || 'Falha ao buscar catálogo.',
            products: [],
            totalCount: 0
        }
    }
}
