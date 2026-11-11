import { MessageCircle, Clapperboard, LineChart, PackageSearch, CalendarHeart } from "lucide-react"
import { SectionHeading } from "@/components/brand/SectionHeading"

const agents = [
  {
    icon: MessageCircle,
    name: "Zara",
    role: "Vendas no WhatsApp",
    desc: "Escreve a mensagem certa para cada cliente, pronta para copiar e enviar. Também treina você em simulações de atendimento.",
  },
  {
    icon: Clapperboard,
    name: "Clara",
    role: "Conteúdo",
    desc: "Sugere posts e roteiros de Reels com base no que você tem em estoque e no seu jeito de falar.",
  },
  {
    icon: LineChart,
    name: "Finn",
    role: "Financeiro",
    desc: "Explica o caixa em português simples: o que entrou, o que falta receber e quanto sobrou de lucro.",
  },
  {
    icon: PackageSearch,
    name: "Nina",
    role: "Estoque",
    desc: "Avisa quando um produto está acabando e ajuda a decidir o que repor antes de perder venda.",
  },
  {
    icon: CalendarHeart,
    name: "Lia",
    role: "Assistente pessoal",
    desc: "Lembra entregas, cobranças e compromissos e organiza o seu dia de revenda.",
  },
]

export function AgentsShowcase() {
  return (
    <section id="agentes" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Assistentes de IA"
          title="Cinco ajudantes, cada uma no que sabe fazer."
          subtitle="Você continua no comando. Elas preparam, lembram e sugerem; a decisão final é sempre sua."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(({ icon: Icon, name, role, desc }) => (
            <article
              key={name}
              className="rounded-2xl bg-white dark:bg-card border border-border p-7 shadow-soft hover:shadow-lift transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="h-12 w-12 rounded-full bg-brand-grena text-brand-marfim grid place-items-center">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold leading-none">{name}</h3>
                  <p className="text-xs uppercase tracking-widest text-brand-ouro-escuro mt-1.5">{role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
