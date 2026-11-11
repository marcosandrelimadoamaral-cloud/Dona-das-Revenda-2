import Link from "next/link"
import { Check, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    id: "monthly",
    name: "O Cauteloso",
    cycle: "Mensal",
    price: "97,00",
    billing: "Cobrado mensalmente",
    description: "Flexibilidade total para começar. Sem fidelidade.",
    features: [
      "5 Agentes de IA incluídos",
      "Catálogo multi-marca ilimitado",
      "PDV, Fiados e Estoque",
      "Dashboard Financeiro completo",
      "Relatórios Excel",
    ],
    badge: "",
    cta: "Assinar mensalmente",
    popular: false,
  },
  {
    id: "annual",
    name: "VIP Anual (A Líder)",
    cycle: "Anual",
    price: "47,50",
    billing: "De R$ 97 por R$ 47,50/mês",
    totalBilling: "Cobrado R$ 570 uma vez por ano",
    description: "Para quem leva a revenda a sério. Economia absurda de R$ 594 no ano.",
    features: [
      "Tudo do plano mensal",
      "Economia de 51% (R$ 594 livre)",
      "Suporte com prioridade",
      "IA no WhatsApp (acesso antecipado)",
      "Próximas funcionalidades em primeira mão",
    ],
    badge: "OFERTA: 51% OFF + 7 DIAS GRÁTIS",
    cta: "Quero economizar e lucrar mais",
    popular: true,
  },
  {
    id: "quarterly",
    name: "O Equilíbrio",
    cycle: "Trimestral",
    price: "87,00",
    billing: "R$ 261 a cada 3 meses",
    description: "Desconto justo sem compromisso anual.",
    features: ["Tudo do plano mensal", "10% de desconto", "Renovação automática a cada 90 dias"],
    badge: "",
    cta: "Começar trimestral",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="precos" className="py-20 md:py-28 bg-white dark:bg-card border-y border-border scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-grena mb-3">Preços</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Um investimento que se paga na primeira venda</h2>
          <p className="text-xl text-muted-foreground">Todos os planos incluem 7 dias grátis para testar sem compromisso.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-8 border ${
                plan.popular ? "bg-brand-grena text-brand-marfim border-brand-grena shadow-lift" : "bg-background border-border"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-6 right-6 mx-auto w-fit rounded-full bg-brand-ouro text-brand-tinta px-3 py-1 text-xs font-bold tracking-wide text-center">
                  {plan.badge}
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-widest ${plan.popular ? "text-brand-quartzo-claro" : "text-muted-foreground"}`}>
                {plan.cycle}
              </p>
              <h3 className="text-2xl font-bold mt-1">{plan.name}</h3>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-sm opacity-70">R$</span>
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-sm opacity-70">/mês</span>
              </p>
              <p className={`mt-2 text-sm ${plan.popular ? "text-brand-quartzo-claro" : "text-muted-foreground"}`}>{plan.billing}</p>
              {plan.totalBilling && <p className="text-xs text-brand-quartzo-claro">{plan.totalBilling}</p>}
              <p className={`mt-4 text-sm min-h-[40px] ${plan.popular ? "text-brand-quartzo-claro" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <ul className="mt-5 mb-8 space-y-3 text-sm flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.popular ? "text-brand-ouro" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className={`w-full h-12 rounded-xl ${
                  plan.popular
                    ? "bg-brand-marfim text-brand-grena hover:bg-white"
                    : "bg-primary text-primary-foreground hover:bg-brand-grena-hover"
                }`}
              >
                <Link href={`/checkout?plan=${plan.id}`}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10 flex items-start gap-3 rounded-2xl bg-brand-quartzo-fundo dark:bg-muted p-5 text-sm">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Garantia Blindada:</span> Cancele a qualquer momento com apenas 1 clique. Pagamento 100%
            seguro. Teste grátis os 7 primeiros dias.
          </p>
        </div>
      </div>
    </section>
  )
}
