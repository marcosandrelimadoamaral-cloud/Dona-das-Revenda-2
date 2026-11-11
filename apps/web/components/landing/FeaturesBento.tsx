import { ShoppingBag, Boxes, Users, WalletCards, RefreshCcw, CalendarDays, Layers, FileSpreadsheet } from "lucide-react"
import { SectionHeading } from "@/components/brand/SectionHeading"

const features = [
  { icon: ShoppingBag, title: "Ponto de venda", desc: "Registre uma venda em segundos, com vários meios de pagamento e histórico completo." },
  { icon: Boxes, title: "Estoque", desc: "Saiba o que tem, o que está acabando e quanto dinheiro está parado nas prateleiras." },
  { icon: Users, title: "Clientes", desc: "Ficha de cada cliente com compras, preferências e o que ela ainda deve." },
  { icon: WalletCards, title: "Fiados", desc: "Quem deve, quanto e desde quando, com lembretes de cobrança sem constrangimento." },
  { icon: Layers, title: "Catálogo multimarca", desc: "Natura, Avon, Boticário e outras. Leve um produto do catálogo ao estoque com um clique." },
  { icon: RefreshCcw, title: "Trocas e devoluções", desc: "Cada troca registrada, sem perder o controle do estoque nem do caixa." },
  { icon: CalendarDays, title: "Agenda", desc: "Entregas, visitas e cobranças organizadas num calendário só seu." },
  { icon: FileSpreadsheet, title: "Relatórios", desc: "Financeiro completo, exportável para Excel quando você precisar." },
]

export function FeaturesBento() {
  return (
    <section id="funcionalidades" className="py-20 md:py-28 bg-brand-quartzo-fundo dark:bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Tudo da revenda" title="O que você precisa para tocar o negócio, sem remendo." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-white dark:bg-card border border-border p-6">
              <Icon className="h-6 w-6 text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-8">
          Em breve: a Zara atendendo direto no WhatsApp, com a sua aprovação.
        </p>
      </div>
    </section>
  )
}
