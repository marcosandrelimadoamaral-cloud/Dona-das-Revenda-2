'use server';

import { createClient } from '@/lib/supabase/server';
import { AIAgentConfig, AgentType } from 'database';

export async function getAgentConfig(agentType: AgentType): Promise<{ data: AIAgentConfig | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { data: null, error: 'Não autenticado' };

    const { data, error } = await supabase
      .from('ai_agents_config')
      .select('*')
      .eq('agent_type', agentType)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
