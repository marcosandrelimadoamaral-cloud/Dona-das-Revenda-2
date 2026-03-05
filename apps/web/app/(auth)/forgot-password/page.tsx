"use client"

import { useState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { AuthCard } from "@/components/auth/AuthCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { resetPassword } from "@/app/actions/auth/resetPassword"
import { motion } from "framer-motion"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={pending}>
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Enviar link de recuperação
        </Button>
    )
}

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <AuthCard
                title="Recuperar senha"
                description="Digite seu email para receber um link de redefinição de senha"
            >
                {success ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Email enviado!</h3>
                            <p className="text-sm text-muted-foreground">
                                Se o email estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="w-full mt-4">
                            <Link href="/login">Voltar para o login</Link>
                        </Button>
                    </div>
                ) : (
                    <form action={async (formData) => {
                        setError(null)
                        const result = await resetPassword(formData)
                        if (result?.error) {
                            setError("Ocorreu um erro ao enviar o email. Tente novamente.")
                        } else {
                            setSuccess(true)
                        }
                    }} className="space-y-4">

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex flex-row items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email cadastrado</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="pl-10"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <SubmitButton />

                        <div className="pt-2 text-center text-sm">
                            <Link href="/login" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" />
                                Voltar para o login
                            </Link>
                        </div>
                    </form>
                )}
            </AuthCard>
        </motion.div>
    )
}
