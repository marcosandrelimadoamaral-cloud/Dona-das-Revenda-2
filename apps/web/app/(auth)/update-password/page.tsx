"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { AuthCard } from "@/components/auth/AuthCard"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { updatePassword } from "@/app/actions/auth/updatePassword"
import { motion } from "framer-motion"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={pending}>
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Atualizar senha
        </Button>
    )
}

export default function UpdatePasswordPage() {
    const [error, setError] = useState<string | null>(null)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <AuthCard
                title="Nova senha"
                description="Digite sua nova senha de acesso abaixo"
            >
                <form action={async (formData) => {
                    setError(null)

                    const password = formData.get("password") as string
                    const confirmPassword = formData.get("confirmPassword") as string

                    if (password !== confirmPassword) {
                        setError("As senhas não coincidem")
                        return
                    }

                    if (password.length < 8) {
                        setError("A senha deve ter no mínimo 8 caracteres")
                        return
                    }

                    const result = await updatePassword(formData)
                    if (result?.error) {
                        setError(result.error)
                    }
                }} className="space-y-4">

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex flex-row items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">Nova senha</Label>
                        <PasswordInput name="password" showStrength={true} autoComplete="new-password" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
                        <PasswordInput name="confirmPassword" placeholder="Repita a nova senha" autoComplete="new-password" />
                    </div>

                    <SubmitButton />
                </form>
            </AuthCard>
        </motion.div>
    )
}
