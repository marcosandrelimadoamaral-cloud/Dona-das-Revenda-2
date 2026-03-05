'use server';

import { createClient } from '@/lib/supabase/server';
import { Client } from 'database';

export async function getClientById(id: string): Promise<{ data: Client | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: null, error: 'Não autenticado' };

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
