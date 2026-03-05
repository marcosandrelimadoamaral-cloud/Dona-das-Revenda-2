'use server';

import { createClient } from '@/lib/supabase/server';
import { CatalogProduct } from 'database';

export async function getCatalogProducts(brand?: string): Promise<{ data: CatalogProduct[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('catalog_products')
      .select('*')
      .eq('is_active', true);

    if (brand) {
      query = query.eq('brand', brand);
    }

    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
