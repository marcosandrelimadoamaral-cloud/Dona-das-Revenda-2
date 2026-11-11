import Link from "next/link"
import { Instagram } from "lucide-react"
import { Logo } from "@/components/brand/Logo"

const linkClass = "text-muted-foreground hover:text-primary transition-colors"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-card border-t border-border pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5" aria-label="Dona da Revenda">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
              Gestão para quem revende beleza: vendas, estoque, fiados, clientes e cinco assistentes de IA num só lugar.
            </p>
            <Link href="#" className={linkClass} aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-base">Produto</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#funcionalidades" className={linkClass}>Funcionalidades</Link></li>
              <li><Link href="#agentes" className={linkClass}>Assistentes de IA</Link></li>
              <li><Link href="#precos" className={linkClass}>Planos</Link></li>
              <li><Link href="/signup" className={linkClass}>Começar grátis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 text-base">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/termos-de-uso" className={linkClass}>Termos de uso</Link></li>
              <li><Link href="/privacidade" className={linkClass}>Privacidade</Link></li>
              <li><Link href="/lgpd" className={linkClass}>LGPD</Link></li>
              <li><Link href="/contato" className={linkClass}>Contato</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">© 2026 Dona da Revenda. Todos os direitos reservados.</p>
          <p className="text-muted-foreground text-xs">Pagamento seguro</p>
        </div>
      </div>
    </footer>
  )
}
