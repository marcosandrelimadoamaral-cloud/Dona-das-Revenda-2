'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const productData = {
      user_id: user.id,
      custom_name: formData.get('custom_name') as string,
      purchase_price: parseFloat(formData.get('purchase_price') as string),
      sale_price: parseFloat(formData.get('sale_price') as string),
      current_stock: parseInt(formData.get('current_stock') as string),
      min_stock_alert: parseInt(formData.get('min_stock_alert') as string) || 5,
      expiration_date: formData.get('expiration_date') as string || null,
      catalog_id: formData.get('catalog_id') as string || null,
      description: formData.get('description') as string || null,
      sku: formData.get('sku') as string || null,
      location: formData.get('location') as string || null,
      status: 'active' as const
    };

    const { error } = await supabase.from('user_products').insert(productData);
    
    if (error) return { error: error.message };
    
    revalidatePath('/app/inventory');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
