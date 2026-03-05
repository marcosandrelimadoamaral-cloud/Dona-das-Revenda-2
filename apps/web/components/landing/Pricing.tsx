"use client"

import { motion } from "framer-motion"
import { Check, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const plans = [
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
    name: "A Líder",
    cycle: "Anual",
    price: "77,50",
    billing: "De R$ 97 por R$ 77,50/mês",
    totalBilling: "Cobrado R$ 930 uma vez por ano",
    description: "Para quem leva a revenda a sério. Mais economia, mais resultado.",
    features: [
      "Tudo do plano mensal",
      "Economia de R$ 234 no ano",
      "Suporte com prioridade",
      "IA no WhatsApp (acesso antecipado)",
      "Próximas funcionalidades em primeira mão",
    ],
    badge: "🔥 MAIS ESCOLHIDO",
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

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
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
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Pagamento 100% seguro via Stripe. 7 dias grátis ou seu dinheiro de volta.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
