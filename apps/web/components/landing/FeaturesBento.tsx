"use client"

import { motion } from "framer-motion"
import { BarChart3, Layers, ShoppingBag, FileText, Users, Receipt, Sparkles, MessageSquare, RefreshCcw, Brain, Wallet, Calendar } from "lucide-react"

const features = [
  { icon: BarChart3, title: "Financeiro em Tempo Real", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/50", desc: "Acompanhe faturamento, lucro, ticket médio e capital em estoque. Tudo atualizado automaticamente." },
  { icon: Layers, title: "Catálogo Multi-Marca", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/50", desc: "Natura, Avon, Boticário, Mary Kay e mais. Adicione ao estoque com um clique." },
  { icon: Receipt, title: "Gestão de Fiados", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", desc: "Registre quem deve, gere cobranças e acompanhe pagamentos com facilidade." },
  { icon: ShoppingBag, title: "Ponto de Venda (PDV)", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50", desc: "Registre vendas em segundos. Múltiplos métodos de pagamento. Histórico completo." },
  { icon: Brain, title: "5 Agentes de IA", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/50", desc: "Nina, Clara, Max, Zara e Finn — cada um especialista em uma área do seu negócio." },
  { icon: MessageSquare, title: "IA no WhatsApp (em breve)", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/50", desc: "A Zara vai atender clientes e cobrar fiados pelo WhatsApp enquanto você dorme." },
  { icon: Calendar, title: "Agenda Inteligente", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/50", desc: "Organize seus compromissos, entregas e clientes em um calendário visual." },
  { icon: RefreshCcw, title: "Trocas e Devoluções", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/50", desc: "Registre e acompanhe todas as trocas e devoluções de produtos com rastreabilidade total." },
  { icon: Wallet, title: "Relatórios Excel", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/50", desc: "Exporte relatórios financeiros completos para Excel com um clique." },
]

export function FeaturesBento() {
  return (
    <section id="funcionalidades" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">Funcionalidades</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Tudo que você precisa,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">em um só lugar</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Esqueça as planilhas e os 5 apps diferentes. A Dona da Revenda centraliza toda sua operação.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
