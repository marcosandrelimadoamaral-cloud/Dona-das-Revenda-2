import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = createClient()
        const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && authData.user) {
            // Setup automated profile creation for first time social logins
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, onboarding_completed')
                .eq('id', authData.user.id)
                .single()

            if (!profile) {
                const email = authData.user.email
                const fullName = authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || email?.split('@')[0] || 'Usuário'

                console.log('[OAUTH CALLBACK] Gerando perfil para nova conta:', fullName)
                await supabase.from('profiles').insert({
                    id: authData.user.id,
                    full_name: fullName,
                    email: email,
                    onboarding_completed: false,
                })
            }

            // Successfully authenticated
            // Middleware handles further redirection to onboarding if needed
            return NextResponse.redirect(`${origin}/dashboard`)
        }

        // Fallback error from Code Exchange
        console.error('[OAUTH CALLBACK] Erro trocando código por sessão:', error)
    }

    // Redirect to login on error or missing code
    return NextResponse.redirect(`${origin}/login?error=Nao_foi_possivel_autenticar`)
}
