'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BrandType } from 'database';

export async function updateBrands(brands: BrandType[]) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('profiles')
      .update({ brands_sold: brands })
      .eq('id', user.id);
    
    if (error) return { error: error.message };
    
    revalidatePath('/app/profile');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
