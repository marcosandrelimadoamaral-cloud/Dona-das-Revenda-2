'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteClient(id: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) return { error: error.message };
    
    revalidatePath('/app/clients');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
