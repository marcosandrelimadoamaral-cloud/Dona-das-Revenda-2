'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function oauthGoogle() {
    console.log('[OAUTH] Iniciando login com Google');
    const supabase = createClient();

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';
    const redirectUrl = `${siteUrl}/auth/callback`;

    console.log('[OAUTH] URL de redirecionamento:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
        },
    });

    if (error) {
        console.error('[OAUTH] Erro ao iniciar OAuth com Google:', error.message);
        return { error: 'Não foi possível conectar com o Google. Tente novamente.' };
    }

    if (data.url) {
        console.log('[OAUTH] Redirecionando para URL do provedor...');
        redirect(data.url);
    }
}
