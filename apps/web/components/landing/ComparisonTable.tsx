"use client"

import { Check, X, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const features = [
  {
    name: "Gestão de estoque multi-marca",
    planilha: { type: "cross", text: "Manual" },
    empresaria: { type: "check", text: "Limitado" },
    kyte: { type: "check", text: "Genérico" },
    nos: { type: "check", text: "Inteligente com previsão", highlight: true }
  },
  {
    name: "Criação de conteúdo (Reels)",
    planilha: { type: "cross", text: "Não tem" },
    empresaria: { type: "warning", text: "Básico" },
    kyte: { type: "cross", text: "Não tem" },
    nos: { type: "check", text: "IA Nativa (Clara)", highlight: true }
  },
  {
    name: "Atendimento WhatsApp automático",
    planilha: { type: "cross", text: "Não tem" },
    empresaria: { type: "cross", text: "Não tem" },
    kyte: { type: "cross", text: "Não tem" },
    nos: { type: "check", text: "Zara 24h (em breve)", highlight: true }
  },
  {
    name: "Análise financeira preditiva",
    planilha: { type: "cross", text: "Fórmulas" },
    empresaria: { type: "cross", text: "Simples" },
    kyte: { type: "cross", text: "Básico" },
    nos: { type: "check", text: "CFO Virtual (Finn)", highlight: true }
  },
  {
    name: "Gestão de Fiados",
    planilha: { type: "warning", text: "Manual" },
    empresaria: { type: "cross", text: "Não tem" },
    kyte: { type: "cross", text: "Não tem" },
    nos: { type: "check", text: "Automático com alertas", highlight: true }
  },
  {
    name: "PDV (Ponto de Venda)",
    planilha: { type: "cross", text: "Não tem" },
    empresaria: { type: "warning", text: "Básico" },
    kyte: { type: "check", text: "Sim" },
    nos: { type: "check", text: "Completo + Histórico", highlight: true }
  },
  {
    name: "Preço mensal",
    planilha: { type: "text", text: "Grátis" },
    empresaria: { type: "text", text: "R$ 40,90" },
    kyte: { type: "text", text: "R$ 49,90" },
    nos: { type: "text", text: "R$ 97*", highlight: true, subtext: "mas entrega 10x mais valor" }
  }
]

export function ComparisonTable() {
  const renderIcon = (type: string) => {
    if (type === "check") return <Check className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
    if (type === "cross") return <X className="w-5 h-5 text-rose-500 mx-auto mb-1" />
    if (type === "warning") return <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
    return null
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">Comparativo</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Por que migrar da planilha?
          </h2>
          <p className="text-xl text-muted-foreground">
            Compare e veja porque somos a escolha das revendedoras que querem escalar.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto pb-8 pt-4"
        >
          <div className="min-w-[720px] max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 shadow-sm overflow-visible">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold w-1/3">Funcionalidade</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-center">Planilha</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-center hidden md:table-cell">Empresária Online</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-center hidden md:table-cell">Kyte</th>
                  <th className="px-6 py-4 font-bold text-indigo-700 dark:text-indigo-400 text-center bg-indigo-50/50 dark:bg-indigo-950/30 border-l border-r border-indigo-100 dark:border-indigo-900 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full flex justify-center">
                      <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 text-white text-xs">Melhor Custo-Benefício</Badge>
                    </div>
                    Plano PRO (Você)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {features.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{feature.name}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">
                      {renderIcon(feature.planilha.type)}
                      <span className="text-xs">{feature.planilha.text}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground hidden md:table-cell">
                      {renderIcon(feature.empresaria.type)}
                      <span className="text-xs">{feature.empresaria.text}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground hidden md:table-cell">
                      {renderIcon(feature.kyte.type)}
                      <span className="text-xs">{feature.kyte.text}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20 border-l border-r border-indigo-50 dark:border-indigo-900">
                      {renderIcon(feature.nos.type)}
                      <span className="text-sm">{feature.nos.text}</span>
                      {feature.nos.subtext && (
                        <div className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1 font-normal">{feature.nos.subtext}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
