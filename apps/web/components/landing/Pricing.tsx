import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/brand/SectionHeading"

const included = [
  "5 assistentes de IA",
  "PDV, estoque, clientes e fiados",
  "Catálogo multimarca",
  "Financeiro e relatórios em Excel",
  "Agenda e trocas",
]

const plans = [
  {
    id: "monthly",
    name: "Mensal",
    price: "97,00",
    note: "Cobrado todo mês. Sem fidelidade.",
    highlight: false,
    cta: "Começar 7 dias grátis",
    extras: [] as string[],
  },
  {
    id: "quarterly",
    name: "Trimestral",
    price: "87,00",
    note: "R$ 261 a cada 3 meses. 10% de desconto.",
    highlight: false,
    cta: "Começar 7 dias grátis",
    extras: [] as string[],
  },
  {
    id: "annual",
    name: "Anual",
    price: "47,50",
    note: "R$ 570 por ano. 51% de desconto: economia de R$ 594.",
    highlight: true,
    cta: "Começar 7 dias grátis",
    extras: ["Suporte com prioridade", "Novidades em primeira mão"],
  },
]

export function Pricing() {
  return (
    <section id="precos" className="py-20 md:py-28 bg-white dark:bg-card border-y border-border scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Planos"
          title="Um preço claro. Sete dias para testar."
          subtitle="Todos os planos têm tudo. Você só escolhe como prefere pagar."
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-8 border ${
                plan.highlight
                  ? "bg-brand-grena text-brand-marfim border-brand-grena shadow-lift"
                  : "bg-background border-border"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand-ouro text-brand-tinta px-3 py-1 text-xs font-semibold tracking-wide">
                  Melhor valor
                </span>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-sm opacity-70">R$</span>
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-sm opacity-70">/mês</span>
              </p>
              <p className={`mt-2 text-sm min-h-[40px] ${plan.highlight ? "text-brand-quartzo-claro" : "text-muted-foreground"}`}>
                {plan.note}
              </p>

              <ul className="mt-6 mb-8 space-y-3 text-sm flex-1">
                {[...included, ...plan.extras].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlight ? "text-brand-ouro" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className={`w-full h-12 rounded-xl ${
                  plan.highlight
                    ? "bg-brand-marfim text-brand-grena hover:bg-white"
                    : "bg-primary text-primary-foreground hover:bg-brand-grena-hover"
                }`}
              >
                <Link href={`/checkout?plan=${plan.id}`}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Pagamento seguro. Cancele quando quiser, sem multa.
        </p>
      </div>
    </section>
  )
}
