'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autenticado' };

    const updates: Record<string, any> = {
      custom_name: formData.get('custom_name') as string,
      purchase_price: parseFloat(formData.get('purchase_price') as string),
      sale_price: parseFloat(formData.get('sale_price') as string),
      current_stock: parseInt(formData.get('current_stock') as string),
      min_stock_alert: parseInt(formData.get('min_stock_alert') as string) || 5,
    };

    const expirationDate = formData.get('expiration_date') as string;
    if (expirationDate) updates.expiration_date = expirationDate;

    const location = formData.get('location') as string;
    if (location) updates.location = location;

    const { error } = await supabase
      .from('user_products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    revalidatePath('/pos');

    return { success: true };
  } catch (error: any) {
    console.error('updateProduct error:', error);
    return { error: error.message };
  }
}
