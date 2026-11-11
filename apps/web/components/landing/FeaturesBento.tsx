import { BarChart3, Layers, Receipt, ShoppingBag, Brain, MessageSquare, Calendar, RefreshCcw, Wallet } from "lucide-react"

const features = [
  { icon: BarChart3, title: "Financeiro em Tempo Real", desc: "Acompanhe faturamento, lucro, ticket médio e capital em estoque. Tudo atualizado automaticamente." },
  { icon: Layers, title: "Catálogo Multi-Marca", desc: "Natura, Avon, Boticário, Mary Kay e mais. Adicione ao estoque com um clique." },
  { icon: Receipt, title: "Gestão de Fiados", desc: "Registre quem deve, gere cobranças e acompanhe pagamentos com facilidade." },
  { icon: ShoppingBag, title: "Ponto de Venda (PDV)", desc: "Registre vendas em segundos. Múltiplos métodos de pagamento. Histórico completo." },
  { icon: Brain, title: "5 Agentes de IA", desc: "Nina, Clara, Lia, Zara e Finn — cada um especialista em uma área do seu negócio." },
  { icon: MessageSquare, title: "IA no WhatsApp (em breve)", desc: "A Zara vai atender clientes e cobrar fiados pelo WhatsApp enquanto você dorme." },
  { icon: Calendar, title: "Agenda Inteligente", desc: "Organize seus compromissos, entregas e clientes em um calendário visual." },
  { icon: RefreshCcw, title: "Trocas e Devoluções", desc: "Registre e acompanhe todas as trocas e devoluções de produtos com rastreabilidade total." },
  { icon: Wallet, title: "Relatórios Excel", desc: "Exporte relatórios financeiros completos para Excel com um clique." },
]

export function FeaturesBento() {
  return (
    <section id="funcionalidades" className="py-20 md:py-28 bg-brand-quartzo-fundo dark:bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-grena mb-3">Funcionalidades</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Tudo que você precisa, <span className="text-primary">em um só lugar</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Esqueça as planilhas e os 5 apps diferentes. A Dona da Revenda centraliza toda sua operação.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-white dark:bg-card border border-border p-6">
              <span className="h-11 w-11 rounded-xl bg-brand-quartzo-claro text-brand-grena grid place-items-center mb-4">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
