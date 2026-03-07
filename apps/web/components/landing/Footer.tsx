import Link from "next/link"
import Image from "next/image"
import { Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t dark:border-gray-800 pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo-transparent.png" alt="Dona da Revenda" width={64} height={64} className="object-contain" />
              <span className="font-bold text-xl tracking-tight">Dona da Revenda</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
              A primeira plataforma de gestão para revendedoras de cosméticos 100% movida a Inteligência Artificial. PDV, fiados, estoque, financeiro e 5 agentes de IA — tudo em um só lugar.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider">Produto</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#funcionalidades" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Funcionalidades</Link></li>
              <li><Link href="#precos" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Preços</Link></li>
              <li><Link href="#agentes" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Agentes IA</Link></li>
              <li><Link href="/signup" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Começar grátis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/termos-de-uso" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacidade</Link></li>
              <li><Link href="/lgpd" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">LGPD</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Dona da Revenda. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-xs">
            Pagamento seguro via 🔒 Stripe
          </p>
        </div>
      </div>
    </footer>
  )
}
