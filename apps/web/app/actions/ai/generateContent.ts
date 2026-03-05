'use server';

import { getAI } from 'ai-agents';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function generateReelScript(productId: string, objective: 'sales' | 'engagement' = 'sales') {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const { data: product } = await supabase
      .from('user_products')
      .select('*, catalog_products(*)')
      .eq('id', productId)
      .eq('user_id', user.id)
      .single();

    if (!product) return { error: 'Produto não encontrado' };

    const ai = getAI();
    const result = await ai.clara.generateContent({
      product,
      objective,
      tone: 3,
      targetAudience: 'Mulheres 30-50 anos, classe B/C'
    });

    // Salvar no log
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      agent_type: 'clara',
      input_context: JSON.stringify({ productId, objective }),
      output_content: JSON.stringify(result.data),
      context_data: {}
    });

    return { data: result.data, error: null };
  } catch (error: any) {
    console.error('Erro na geração de conteúdo:', error);
    return { error: 'Erro ao gerar conteúdo. Verifique se a API key está configurada.' };
  }
}
