'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Gets AI settings for the user from the ai_agents_config table.
 * We use a 'nina' agent record as the global config store for user preferences.
 */
export async function getAiSettings() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('ai_agents_config')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_type', 'nina')
        .maybeSingle()

    if (error) {
        console.error('Error fetching AI settings:', error.message)
        return null
    }

    // Flatten the settings JSONB into a more convenient shape for the form
    const settings = data?.settings || {}
    return {
        user_name: settings.user_name || '',
        store_name: settings.store_name || '',
        target_audience: settings.target_audience || '',
        persona_preferences: settings.persona_preferences || '',
        tone_of_voice: data?.tone_of_voice ?? 3,
        is_active: data?.is_active ?? true,
    }
}

/**
 * Updates AI settings — stores user preferences in the ai_agents_config table
 * under the 'nina' agent record (as the global config).
 */
export async function updateAiSettings(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado' }

    const userName = formData.get('user_name') as string
    const storeName = formData.get('store_name') as string
    const targetAudience = formData.get('target_audience') as string
    const personaPreferences = formData.get('persona_preferences') as string

    const settingsPayload = {
        user_name: userName,
        store_name: storeName,
        target_audience: targetAudience,
        persona_preferences: personaPreferences,
    }

    // Build a custom pre-prompt from the preferences
    let parsedPrefs: any = {}
    try { parsedPrefs = JSON.parse(personaPreferences || '{}') } catch { }

    const tone = parsedPrefs.tone || 'amigavel'
    const style = parsedPrefs.style || 'objetivo'
    const useEmoji = parsedPrefs.use_emoji !== false
    const greeting = parsedPrefs.greeting || ''

    const toneMap: Record<string, string> = {
        amigavel: 'Seja calorosa, próxima e encorajadora.',
        profissional: 'Seja clara, direta e profissional.',
        descontraida: 'Seja informal, com bom humor e leveza.',
        motivacional: 'Seja energética, inspiradora e positiva.',
    }
    const styleMap: Record<string, string> = {
        detalhado: 'Dê explicações completas com contexto.',
        objetivo: 'Seja direta e concisa, sem rodeios.',
        exemplos: 'Sempre ilustre com exemplos práticos.',
        listas: 'Prefira bullet points e listas organizadas.',
    }

    const customPromptText = [
        `Você está falando com ${userName || 'a revendedora'}${storeName ? `, dona do(a) ${storeName}` : ''}.`,
        toneMap[tone],
        styleMap[style],
        useEmoji ? 'Pode usar emojis para tornar a conversa mais expressiva.' : 'Não use emojis nas respostas.',
        greeting ? `Quando precisar cumprimentar, use: "${greeting}"` : '',
        targetAudience ? `O público-alvo do negócio é: ${targetAudience}.` : '',
    ].filter(Boolean).join(' ')

    // Tone of voice: 1=formal, 5=informal
    const toneOfVoiceMap: Record<string, number> = {
        profissional: 1,
        objetivo: 2,
        amigavel: 3,
        exemplos: 4,
        descontraida: 4,
        motivacional: 5,
    }
    const toneOfVoice = toneOfVoiceMap[tone] || 3

    const { error } = await supabase
        .from('ai_agents_config')
        .upsert(
            {
                user_id: user.id,
                agent_type: 'nina',
                settings: settingsPayload,
                custom_prompts: { user_context: customPromptText },
                tone_of_voice: toneOfVoice,
                is_active: true,
            },
            { onConflict: 'user_id, agent_type' }
        )

    if (error) {
        console.error('Error saving AI settings:', error.message)
        return { error: 'Falha ao salvar preferências de IA: ' + error.message }
    }

    revalidatePath('/settings/ai')
    revalidatePath('/ai')

    return { success: true }
}
