'use server';

import { createClient } from '@/lib/supabase/server';
import { Client } from 'database';

export async function getClients(): Promise<{ data: Client[] | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: null, error: 'Não autenticado' };

    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        sales (
          created_at,
          sale_date,
          total_revenue,
          status
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process the nested sales array to calculate metrics
    const processedData = (data || []).map(client => {
      let totalSpent = 0;
      let lastPurchase: Date | null = null;

      if (client.sales && Array.isArray(client.sales)) {
        client.sales.forEach((sale: any) => {
          if (sale.status === 'paid') {
            totalSpent += Number(sale.total_revenue || 0);
          }

          // Fallback between sale_date and created_at
          const saleDateStr = sale.sale_date || sale.created_at;
          if (saleDateStr) {
            const dateObj = new Date(saleDateStr);
            if (!lastPurchase || dateObj > lastPurchase) {
              lastPurchase = dateObj;
            }
          }
        });
      }

      // Remove the raw sales array to avoid sending massive payload to client component, 
      // replace with calculated stats
      const { sales, ...clientData } = client;

      return {
        ...clientData,
        total_spent: totalSpent,
        last_purchase_date: lastPurchase ? (lastPurchase as any).toISOString() : null
      };
    });

    return { data: processedData, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
