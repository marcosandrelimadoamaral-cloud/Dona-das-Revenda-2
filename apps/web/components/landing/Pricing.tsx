"use client"

import { motion } from "framer-motion"
import { Check, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const desktopPlans = [
  {
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
    popular: false
  },
  {
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
    badge: "🔥 OFERTA: 51% OFF + 7 DIAS GRÁTIS",
    cta: "Quero economizar e lucrar mais",
    popular: true
  },
  {
    name: "O Equilíbrio",
    cycle: "Trimestral",
    price: "87,00",
    billing: "R$ 261 a cada 3 meses",
    description: "Desconto justo sem compromisso anual.",
    features: [
      "Tudo do plano mensal",
      "10% de desconto",
      "Renovação automática a cada 90 dias",
    ],
    badge: "",
    cta: "Começar trimestral",
    popular: false
  }
]

const mobilePlans = [
  {
    name: "Plano Basico",
    cycle: "Mensal",
    price: "97,00",
    billing: "Cobrado R$ 97/mês",
    description: "Sem desconto. Para quem gosta de pagar mais caro a longo prazo.",
    features: [
      "5 Agentes de IA incluídos",
      "Catálogo ilimitado",
      "PDV, Fiados e Estoque",
      "Dashboard Financeiro",
    ],
    badge: "",
    cta: "Assinar sem desconto",
    popular: false
  },
  {
    name: "VIP Anual",
    cycle: "Anual",
    price: "47,50",
    billing: "Cobrado R$ 570 anualmente",
    totalBilling: "Equivale a R$ 47,50 por mês",
    description: "Economia absurda de R$ 594 no ano. A escolha óbvia de 96% das usuárias.",
    features: [
      "Tudo do plano mensal",
      "Economia massiva de 51% (R$ 594 livre)",
      "Suporte prioritário VIP",
      "Funcionalidades antecipadas exclusivas",
      "Mentoria com IA Premium",
    ],
    badge: "🔥 OFERTA: 51% OFF + 7 DIAS GRÁTIS",
    cta: "Garantir 51% de Desconto",
    popular: true
  },
  {
    name: "Plano Médio",
    cycle: "Trimestral",
    price: "77,00",
    billing: "Cobrado R$ 231 a cada 3 meses",
    description: "Um pouco de economia.",
    features: [
      "Tudo do plano básico",
      "Apenas 20% de desconto",
    ],
    badge: "",
    cta: "Assinar Trimestral",
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="precos" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">Preços</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Um investimento que se paga na primeira venda
          </h2>
          <p className="text-xl text-muted-foreground">
            Todos os planos incluem 7 dias grátis para testar sem compromisso.
          </p>
        </div>

        {/* DESKTOP PRICING VIEW */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch mt-0">
          {desktopPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border shadow-sm flex flex-col transition-all ${plan.popular
                ? "ring-2 ring-indigo-600 dark:ring-indigo-500 scale-105 shadow-xl z-10 border-indigo-100 dark:border-indigo-900"
                : "border-gray-100 dark:border-gray-700 hover:shadow-md"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-4 py-1.5 text-sm font-bold shadow-md">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="inline-block text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase mb-3">{plan.cycle}</p>
              <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">R$ {plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <div className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400 leading-tight">
                  {plan.billing}
                </div>
                {plan.totalBilling && (
                  <div className="text-xs text-muted-foreground mt-0.5">{plan.totalBilling}</div>
                )}
              </div>

              <Button
                asChild
                className={`w-full mb-6 h-12 rounded-xl text-base font-semibold cursor-pointer ${plan.popular
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                  }`}
              >
                <Link href={`/checkout?plan=${plan.cycle === 'Mensal' ? 'monthly' : plan.cycle === 'Anual' ? 'annual' : 'quarterly'}`}>
                  {plan.cta}
                </Link>
              </Button>

              <div className="space-y-3 flex-1">
                {desktopPlans[i].features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* MOBILE PRICING VIEW - AGGRESSIVE CRO */}
        <div className="grid md:hidden grid-cols-1 gap-8 max-w-6xl mx-auto items-stretch mt-8 mx-4">
          {mobilePlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border shadow-sm flex flex-col transition-all ${plan.popular
                ? "ring-2 ring-indigo-600 dark:ring-indigo-500 scale-105 shadow-xl z-10 border-indigo-100 dark:border-indigo-900"
                : "border-gray-100 dark:border-gray-700 hover:shadow-md"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-4 py-1.5 text-sm font-bold shadow-md">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="inline-block text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase mb-3">{plan.cycle}</p>
              <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">{plan.description}</p>

              <div className="mb-6">
                {plan.popular && (
                  <p className="text-sm font-bold text-red-500 line-through decoration-red-500/50 mb-1">De R$ 97,00/mês</p>
                )}
                <div className={`flex items-baseline gap-1 ${plan.popular ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                  <span className="text-4xl sm:text-5xl font-extrabold">R$ {plan.price}</span>
                  <span className="text-muted-foreground font-medium">/mês</span>
                </div>
                <div className={`text-sm font-bold mt-2 leading-tight ${plan.popular ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {plan.billing}
                </div>
                {plan.totalBilling && (
                  <div className="text-xs font-semibold text-muted-foreground mt-1 opacity-80">{plan.totalBilling}</div>
                )}
              </div>

              <Button
                asChild
                className={`w-full mb-6 h-14 sm:h-16 rounded-2xl text-lg font-extrabold cursor-pointer active:scale-95 transition-all ${plan.popular
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-[0_8px_20px_rgb(239,68,68,0.3)] animate-pulse hover:animate-none"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-none border border-transparent hover:border-gray-300"
                  }`}
              >
                <Link href={`/checkout?plan=${plan.cycle === 'Mensal' ? 'monthly' : plan.cycle === 'Anual' ? 'annual' : 'quarterly'}`}>
                  {plan.cta}
                </Link>
              </Button>

              <div className="space-y-4 flex-1 mt-2">
                {mobilePlans[i].features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-indigo-600' : 'text-emerald-500'}`} />
                    <span className={`text-sm md:text-base font-medium ${plan.popular ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center w-full px-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-950/30 px-6 py-4 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900 w-full max-w-2xl text-center sm:text-left">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <span className="font-bold">Garantia Blindada: Cancele a qualquer momento com apenas 1 clique. Pagamento 100% seguro pelo Stripe. Teste grátis os 7 primeiros dias.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
