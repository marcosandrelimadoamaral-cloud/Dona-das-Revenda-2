'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function completeOnboarding() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id);
    
    if (profileError) throw profileError;

    // Create default AI configs
    const defaultConfigs = [
      { user_id: user.id, agent_type: 'clara', is_active: true, settings: {} },
      { user_id: user.id, agent_type: 'finn', is_active: true, settings: {} },
      { user_id: user.id, agent_type: 'nina', is_active: true, settings: {} },
      { user_id: user.id, agent_type: 'zara', is_active: false, settings: {} },
      { user_id: user.id, agent_type: 'lia', is_active: true, settings: {} },
    ];

    const { error: aiError } = await supabase
      .from('ai_agents_config')
      .upsert(defaultConfigs, { onConflict: 'user_id, agent_type' });

    if (aiError) throw aiError;

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
