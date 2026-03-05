import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ VARIÁVEIS DO SUPABASE NÃO DEFINIDAS NO CLIENTE!')
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
