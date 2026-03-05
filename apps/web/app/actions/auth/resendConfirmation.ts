'use server'

import { createClient } from '@/lib/supabase/server'

// Módulo simples de in-memory rate limiting (Para produção real, usar Redis/Upstash)
const rateLimits = new Map<string, number>()

export async function resendConfirmation(email: string) {
    try {
        if (!email) {
            return { error: 'Email não fornecido.' }
        }

        const now = Date.now()
        const lastSent = rateLimits.get(email)

        // Check rate limit: 60 seconds
        if (lastSent && now - lastSent < 60000) {
            const remainingSeconds = Math.ceil((60000 - (now - lastSent)) / 1000)
            return { error: `Por favor, aguarde ${remainingSeconds} segundos antes de solicitar um novo envio.` }
        }

        const supabase = createClient()

        console.log(`[RESEND EMAIL] Solicitando reenvio para: ${email}`)

        // Tenta reenviar o email
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
            }
        })

        if (error) {
            console.error('[RESEND EMAIL] Erro ao reenviar:', error.message)
            return { error: 'Ocorreu um erro ao tentar reenviar o email. Verifique se o endereço está correto ou já foi confirmado.' }
        }

        // Registra o tempo do último envio bem-sucedido
        rateLimits.set(email, now)

        console.log(`[RESEND EMAIL] Sucesso! Email reenviado para: ${email}`)
        return { success: true }

    } catch (err: any) {
        console.error('[RESEND EMAIL] Erro inesperado:', err)
        return { error: 'Ocorreu um erro inesperado. Tente novamente mais tarde.' }
    }
}
