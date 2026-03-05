'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('user_products')
      .delete()
      .eq('id', productId)
      .eq('user_id', user.id);
    
    if (error) return { error: error.message };
    
    revalidatePath('/app/inventory');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
