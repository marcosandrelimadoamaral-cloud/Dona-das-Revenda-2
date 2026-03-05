'use server';

import { getAI } from 'ai-agents';
import { createClient } from '@/lib/supabase/server';

export async function analyzeProductPricing(productId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autenticado' };

    const { data: product } = await supabase
      .from('user_products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', user.id)
      .single();

    if (!product) return { error: 'Produto não encontrado' };

    const ai = getAI();
    const result = await ai.finn.analyzePricing({
      product,
      fixed_expenses: 1200,
      avg_monthly_sales: 10,
      target_margin: 0.30
    });

    return { data: result.data, error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}
