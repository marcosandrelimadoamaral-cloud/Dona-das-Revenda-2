'use server';

import { createClient } from '@/lib/supabase/server';
import { UserProduct } from 'database';

export async function getLowStockProducts(): Promise<{ data: UserProduct[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Não autenticado' };

    const { data, error } = await supabase
      .from('user_products')
      .select(`
        *,
        catalog_products(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'low_stock')
      .order('current_stock', { ascending: true });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Erro ao buscar produtos' };
  }
}
