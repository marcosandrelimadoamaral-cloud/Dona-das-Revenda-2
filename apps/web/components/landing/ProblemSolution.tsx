import { NotebookPen, Hourglass, WalletCards } from "lucide-react"
import { SectionHeading } from "@/components/brand/SectionHeading"

const items = [
  {
    icon: NotebookPen,
    pain: "Caderninho, planilha e mensagens soltas",
    fix: "Tudo num só lugar: clientes, pedidos, estoque e o histórico de cada venda.",
  },
  {
    icon: WalletCards,
    pain: "Fiado esquecido e dinheiro que não aparece",
    fix: "Você vê quem deve, quanto e desde quando, e o Finn mostra o seu lucro de verdade.",
  },
  {
    icon: Hourglass,
    pain: "Falta tempo para responder, postar e repor",
    fix: "Zara, Clara e Nina cuidam do trabalho repetitivo. Você decide, elas adiantam.",
  },
]

export function ProblemSolution() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Do aperto ao controle" title="Revender dá trabalho. A bagunça não precisa dar mais." />
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, pain, fix }) => (
            <div key={pain} className="rounded-2xl border border-border bg-background p-7">
              <span className="h-11 w-11 rounded-full bg-brand-quartzo-claro text-brand-grena grid place-items-center mb-5">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm text-muted-foreground line-through decoration-brand-quartzo mb-3">{pain}</p>
              <p className="font-display text-xl font-semibold leading-snug">{fix}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
