'use server';

import { createClient } from '@/lib/supabase/server';

export async function saveFeedback(interactionId: string, rating: number) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
      .from('ai_interactions')
      .update({ user_rating: rating })
      .eq('id', interactionId)
      .eq('user_id', user.id);
    
    if (error) return { error: error.message };
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
