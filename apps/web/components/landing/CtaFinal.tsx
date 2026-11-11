import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/Logo"

export function CtaFinal() {
  return (
    <section className="px-4 pb-20 md:pb-28 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-brand-grena text-brand-marfim px-5 sm:px-6 py-14 md:py-20 text-center">
          <div className="mx-auto mb-6 w-fit">
            <Logo variant="simboloClaro" className="h-14 w-auto" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] max-w-2xl mx-auto">
            Sua revenda merece uma dona organizada.
          </h2>
          <p className="mt-5 text-lg text-brand-quartzo-claro max-w-xl mx-auto">
            Teste por 7 dias e veja o seu negócio com mais clareza. Cancele quando quiser.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 h-14 w-full sm:w-auto px-6 sm:px-9 text-base rounded-xl bg-brand-marfim text-brand-grena hover:bg-white"
          >
            <Link href="/signup?ref=cta-final">
              Criar minha conta grátis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
