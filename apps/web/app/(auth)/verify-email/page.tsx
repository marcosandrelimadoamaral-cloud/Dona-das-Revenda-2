"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth/AuthCard"
import { resendConfirmation } from "@/app/actions/auth/resendConfirmation"
import { toast } from "sonner"

function VerifyEmailForm() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    const handleResend = async () => {
        if (!email || countdown > 0) return

        setIsResending(true)
        const result = await resendConfirmation(email)
        setIsResending(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Email de confirmação reenviado com sucesso!")
            setCountdown(60) // Cooldown de 60 segundos
        }
    }

    return (
        <AuthCard title="" description="">
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <MailCheck className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Verifique seu email</h1>
                    <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
                        Enviamos um link de confirmação para <br />
                        <span className="font-semibold text-foreground">{email || "seu email"}</span>.
                    </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 w-full text-sm text-left border border-zinc-100 dark:border-zinc-800">
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            Clique no link enviado para ativar sua conta.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            Não recebeu? Verifique a pasta de spam.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            O link expira em 24 horas.
                        </li>
                    </ul>
                </div>

                <div className="w-full space-y-3 pt-2">
                    <Button
                        onClick={handleResend}
                        disabled={isResending || countdown > 0 || !email}
                        variant="outline"
                        className="w-full"
                    >
                        {isResending ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <MailCheck className="w-4 h-4 mr-2" />
                        )}
                        {countdown > 0 ? `Aguarde ${countdown}s para reenviar` : "Reenviar email"}
                    </Button>

                    <Button asChild variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                        <Link href="/login">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para o login
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthCard>
    )
}

export default function VerifyEmailPage() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
        >
            <Suspense fallback={<div className="flex justify-center p-8"><RefreshCw className="w-6 h-6 animate-spin text-purple-600" /></div>}>
                <VerifyEmailForm />
            </Suspense>
        </motion.div>
    )
}
