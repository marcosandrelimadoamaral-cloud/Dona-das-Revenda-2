"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { AuthCard } from "@/components/auth/AuthCard"
import { OAuthButton } from "@/components/auth/OAuthButton"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Loader2, AlertCircle } from "lucide-react"
import { login } from "@/app/actions/auth/login"
import { toast } from "sonner"
import { motion } from "framer-motion"

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={pending}>
      {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
      Entrar
    </Button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  // Check URL params for confirmation success/error
  useEffect(() => {
    if (searchParams.get("confirmed") === "true") {
      setSuccessMsg("Email confirmado com sucesso! Faça login para continuar.")
    } else if (searchParams.get("error") === "invalid_token") {
      setError("O link de confirmação é inválido ou expirou. Tente logar para reenviar.")
    }
  }, [searchParams])

  const handleResend = async () => {
    if (!unconfirmedEmail || isResending) return

    setIsResending(true)
    try {
      // dynamic import so we don't pollute the top context if not needed, 
      // or we can just import it normally. Let's do a normal fetch or use the server action directly.
      const { resendConfirmation } = await import("@/app/actions/auth/resendConfirmation")
      const result = await resendConfirmation(unconfirmedEmail)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Email de confirmação reenviado! Verifique sua caixa de entrada.")
        setError(null)
      }
    } catch (e) {
      toast.error("Erro ao reenviar email.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard
        title="Bem-vinda de volta"
        description="Entre para gerenciar suas vendas e estoque"
      >
        <form action={async (formData) => {
          setError(null);
          setSuccessMsg(null);
          setUnconfirmedEmail(null);

          const email = formData.get("email") as string;
          const result = await login(formData);

          if (result?.error) {
            setError(result.error);
            if (result.error.includes("confirme seu email")) {
              setUnconfirmedEmail(email);
            }
          } else {
            toast.success("Bem-vinda de volta!");
          }
        }} className="space-y-4">

          {successMsg && (
            <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md flex flex-row items-center gap-2">
              <span className="w-4 h-4 shrink-0 flex items-center justify-center bg-emerald-100 rounded-full text-emerald-600">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              {unconfirmedEmail && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-left w-fit text-red-700 font-medium underline hover:text-red-800 disabled:opacity-50"
                >
                  {isResending ? "Reenviando..." : "Clique aqui para reenviar o email"}
                </button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-500 font-medium">
                Esqueci minha senha
              </Link>
            </div>
            <PasswordInput name="password" autoComplete="current-password" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Lembrar de mim
            </label>
          </div>

          <SubmitButton />
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-950 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6">
            <OAuthButton />
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Ainda não tem conta? </span>
          <Link href="/signup" className="text-purple-600 hover:text-purple-500 font-medium">
            Cadastre-se grátis
          </Link>
        </div>
      </AuthCard>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
