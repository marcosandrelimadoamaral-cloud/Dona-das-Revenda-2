'use server';

import { createClient } from '@/lib/supabase/server';

export async function getClientHistory(clientId: string) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { data: null, error: 'Não autenticado' };

        const { data, error } = await supabase
            .from('sales')
            .select('id, sale_date, created_at, status, total_amount, payment_method, total_revenue')
            .eq('user_id', user.id)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { data, error: null };
    } catch (error: any) {
        console.error('getClientHistory error:', error);
        return { data: null, error: error.message };
    }
}
