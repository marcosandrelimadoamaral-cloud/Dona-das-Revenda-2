'use server';

import { createClient } from '@/lib/supabase/server';
import { Sale } from 'database';

export async function getPendingPayments(): Promise<{ data: Sale[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: null, error: 'Não autenticado' };

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        clients(name, phone)
      `)
      .eq('user_id', user.id)
      .eq('is_fiado', true)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
