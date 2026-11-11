import Link from "next/link"
import { ArrowRight, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/Logo"

export function CtaFinal() {
  return (
    <section className="px-4 pb-20 md:pb-28 bg-background">
      <div className="container mx-auto">
        <div className="rounded-[2rem] bg-brand-grena text-brand-marfim px-6 py-16 md:py-20 text-center">
          <div className="mx-auto mb-6 w-fit">
            <Logo variant="simboloClaro" className="h-14 w-auto" />
          </div>
          <p className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium mb-7">
            7 dias grátis para testar
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            Pare de trabalhar para sua revenda. <span className="text-brand-quartzo">Faça ela trabalhar para você.</span>
          </h2>
          <p className="mt-6 text-xl text-brand-quartzo-claro max-w-2xl mx-auto">
            Comece hoje, teste por 7 dias e veja o seu negócio com mais clareza. Cancele quando quiser.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 h-14 px-9 text-base font-bold rounded-xl bg-brand-marfim text-brand-grena hover:bg-white"
          >
            <Link href="/signup?ref=cta-final">
              Criar minha conta grátis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium text-brand-quartzo-claro">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> SSL Seguro
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> LGPD
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Garantia 7 dias
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
