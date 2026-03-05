'use server';

import { createClient } from '@/lib/supabase/server';
import { CatalogProduct } from 'database';

export async function searchCatalog(queryStr: string): Promise<{ data: CatalogProduct[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('catalog_products')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${queryStr}%`)
      .order('name')
      .limit(20);

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
