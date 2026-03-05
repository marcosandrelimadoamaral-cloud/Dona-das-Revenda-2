'use server';

import { createClient } from '@/lib/supabase/server';
import { Client } from 'database';

export async function getUpcomingBirthdays(): Promise<{ data: Client[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: null, error: 'Não autenticado' };

    // Note: In a real app, this would use a more complex query or RPC to find birthdays in the next 30 days
    // For now, we fetch clients with birth_dates
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .not('birth_date', 'is', null)
      .order('birth_date', { ascending: true })
      .limit(10);

    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
