'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSalesMetrics() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    // This is a simplified version. In a real app, you'd use a SQL View or RPC for aggregation.
    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_amount, status, created_at')
      .eq('user_id', user.id);

    if (error) throw error;

    const totalRevenue = sales.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total_amount, 0);
    const pendingRevenue = sales.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.total_amount, 0);

    return { 
      data: {
        totalRevenue,
        pendingRevenue,
        totalSales: sales.length
      }, 
      error: null 
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
