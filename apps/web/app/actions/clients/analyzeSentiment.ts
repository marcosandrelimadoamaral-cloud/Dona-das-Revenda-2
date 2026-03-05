'use server';

import { createClient } from '@/lib/supabase/server';

export async function analyzeSentiment(clientId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    // Placeholder for AI sentiment analysis
    const sentimentScore = Math.floor(Math.random() * 100);

    const { error } = await supabase
      .from('clients')
      .update({ sentiment_score: sentimentScore })
      .eq('id', clientId)
      .eq('user_id', user.id);
    
    if (error) return { error: error.message };
    
    return { success: true, score: sentimentScore };
  } catch (error: any) {
    return { error: error.message };
  }
}
