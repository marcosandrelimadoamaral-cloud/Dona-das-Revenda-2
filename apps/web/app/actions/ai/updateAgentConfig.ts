'use server';

import { createClient } from '@/lib/supabase/server';
import { AgentType } from 'database';

export async function updateAgentConfig(agentType: AgentType, configData: any) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Não autenticado' };

    // Upsert logic
    const { error } = await supabase
      .from('ai_agents_config')
      .upsert({
        user_id: user.id,
        agent_type: agentType,
        ...configData
      }, { onConflict: 'user_id, agent_type' });
    
    if (error) return { error: error.message };
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
