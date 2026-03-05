'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSale(saleData: {
  client_id: string | null;
  items: Array<{ product_id: string; qty: number; price: number; product_name: string }>;
  payment_method: string;
  is_fiado: boolean;
  due_date?: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autenticado' };

    const total_revenue = saleData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let total_cost = 0;

    // 1. Calculate total cost and prepare stock updates
    const productUpdates = [];
    for (const item of saleData.items) {
      const { data: product } = await supabase
        .from('user_products')
        .select('purchase_price, current_stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        total_cost += Number(product.purchase_price || 0) * item.qty;
        productUpdates.push({
          id: item.product_id,
          newStock: product.current_stock - item.qty
        });
      }
    }

    // 2. Insert into sales
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        user_id: user.id,
        client_id: saleData.client_id,
        total_revenue,
        total_cost,
        // Legacy column — still needed until the DB column is dropped
        items: saleData.items.map(i => ({ product_id: i.product_id, qty: i.qty, price: i.price })),
        status: saleData.is_fiado ? 'pending' : 'paid',
        payment_method: saleData.payment_method,
        is_fiado: saleData.is_fiado,
        due_date: saleData.due_date || null
      })
      .select('id')
      .single();

    if (saleError) throw saleError;
    const saleId = sale.id;

    // 3. Insert into sale_items
    const saleItemsToInsert = saleData.items.map(item => ({
      sale_id: saleId,
      product_id: item.product_id,
      quantity: item.qty,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItemsToInsert);

    if (itemsError) throw itemsError;

    // 4. Update products stock
    for (const update of productUpdates) {
      await supabase
        .from('user_products')
        .update({ current_stock: update.newStock })
        .eq('id', update.id);
    }

    revalidatePath('/pos');
    revalidatePath('/estoque');
    revalidatePath('/dashboard');

    return { success: true, saleId };
  } catch (error: any) {
    console.error('Error creating sale:', error);
    return { error: error.message };
  }
}
