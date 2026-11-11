"use client"

import Link from "next/link"
import { useTransition } from "react"
import { Lock, Check, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/Logo"
import { logout } from "@/app/actions/auth/logout"

// Tela que trava o painel inteiro quando o teste grátis acaba e não há assinatura ativa.
export function TrialLockScreen({ name }: { name?: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-10">
        <Logo variant="horizontal" className="h-9 w-auto mb-10" priority />

        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft text-center">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">{name ? `${name}, seu teste grátis terminou` : "Seu teste grátis terminou"}</h1>
          <p className="mt-3 text-muted-foreground">
            Suas vendas, clientes e estoque estão guardados. Assine para voltar a usar o sistema de onde parou.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-left">
            {["Tudo o que você cadastrou continua salvo", "Pix ou cartão, liberação na hora", "Cancele quando quiser, sem multa"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary shrink-0" /> {t}
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-7 w-full h-14 rounded-xl text-base font-semibold">
            <Link href="/checkout?plan=annual">Assinar e liberar meu acesso</Link>
          </Button>
          <Link href="/checkout" className="mt-3 inline-block text-sm text-primary font-medium hover:underline">
            Ver todos os planos
          </Link>
        </div>

        <button
          onClick={() => startTransition(() => logout())}
          disabled={isPending}
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Sair da conta
        </button>
      </div>
    </div>
  )
}
