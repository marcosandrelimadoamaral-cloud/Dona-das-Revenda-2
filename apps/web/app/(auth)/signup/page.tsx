"use client"

import { useState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { AuthCard } from "@/components/auth/AuthCard"
import { OAuthButton } from "@/components/auth/OAuthButton"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, User, Loader2, AlertCircle } from "lucide-react"
import { signup } from "@/app/actions/auth/signup"
import { toast } from "sonner"
import { motion } from "framer-motion"

// Submit button component to use useFormStatus correctly
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={pending}>
      {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
      Criar conta grátis
    </Button>
  );
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [error, setError] = useState<string | null>(null);
  const selectedPlan = typeof searchParams.plan === 'string' ? searchParams.plan : 'mensal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard
        title="Comece grátis"
        description="Crie sua conta e revolucione suas vendas"
      >
        <form action={async (formData) => {
          setError(null);

          const password = formData.get("password") as string;
          const confirmPassword = formData.get("confirmPassword") as string;

          if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
          }

          const terms = formData.get("terms");
          if (!terms) {
            setError("Você precisa aceitar os termos de uso");
            return;
          }

          const result = await signup(formData);

          if (result?.error) {
            setError(result.error);
          } else {
            toast.success("Conta criada com sucesso! Redirecionando...");
          }
        }} className="space-y-4">

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex flex-row items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <input type="hidden" name="plan" value={selectedPlan} />

          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Seu nome"
                className="pl-10"
                required
                autoComplete="name"
              />
            </div>
          </div>

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
            <Label htmlFor="password">Senha</Label>
            <PasswordInput name="password" showStrength={true} autoComplete="new-password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a Senha</Label>
            <PasswordInput name="confirmPassword" placeholder="Repita sua senha" autoComplete="new-password" />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" name="terms" value="true" className="mt-1" />
            <label
              htmlFor="terms"
              className="text-sm leading-tight text-muted-foreground"
            >
              Ao criar conta, você aceita os <Link href="/termos-de-uso" className="text-purple-600 hover:text-purple-500">Termos de Uso</Link> e <Link href="/privacidade" className="text-purple-600 hover:text-purple-500">Política de Privacidade</Link>
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
              <span className="px-2 bg-white dark:bg-gray-950 text-muted-foreground">Ou cadastre-se com</span>
            </div>
          </div>

          <div className="mt-6">
            <OAuthButton />
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Já tem conta? </span>
          <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium">
            Entre aqui
          </Link>
        </div>
      </AuthCard>
    </motion.div>
  )
}
