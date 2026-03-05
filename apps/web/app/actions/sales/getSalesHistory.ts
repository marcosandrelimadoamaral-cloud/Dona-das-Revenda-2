'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSalesHistory() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { data: null, error: 'Não autenticado' };

        // Step 1: Fetch all sales
        const { data: sales, error } = await supabase
            .from('sales')
            .select(`
        id,
        created_at,
        total_revenue,
        total_cost,
        status,
        payment_method,
        is_fiado,
        clients ( name ),
        sale_items (
          quantity,
          price_at_time,
          product_id
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        if (!sales || sales.length === 0) return { data: [], error: null };

        // Step 2: Collect all unique product IDs to resolve names
        const allProductIds = new Set<string>();
        sales.forEach((sale: any) => {
            sale.sale_items?.forEach((item: any) => {
                if (item.product_id) allProductIds.add(item.product_id);
            });
        });

        // Step 3: Fetch product names from user_products
        let productNameMap: Record<string, string> = {};
        if (allProductIds.size > 0) {
            const { data: products } = await supabase
                .from('user_products')
                .select('id, custom_name')
                .in('id', Array.from(allProductIds));

            if (products) {
                products.forEach((p: any) => {
                    productNameMap[p.id] = p.custom_name || 'Produto';
                });
            }
        }

        // Step 4: Map product names into sale items
        const result = sales.map((sale: any) => ({
            ...sale,
            sale_items: sale.sale_items?.map((item: any) => ({
                ...item,
                user_products: { name: productNameMap[item.product_id] || 'Produto Excluído' }
            }))
        }));

        return { data: result, error: null };
    } catch (error: any) {
        console.error('getSalesHistory error:', error);
        return { data: null, error: error.message };
    }
}
