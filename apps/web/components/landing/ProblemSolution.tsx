"use client"

import { motion } from "framer-motion"
import { CalendarX, Ghost, Clock, HelpCircle, CheckCircle2, TrendingUp, Brain, ShoppingCart } from "lucide-react"

const painPoints = [
  { icon: CalendarX, text: "Estoque parado perdendo validade = dinheiro no lixo", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/60" },
  { icon: Ghost, text: "Clientes somem porque você esqueceu de fazer follow-up", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/60" },
  { icon: Clock, text: "Passa horas tentando criar conteúdo e ninguém engaja", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/60" },
  { icon: HelpCircle, text: "Não sabe se está lucrando ou só 'girando' dinheiro", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/60" },
]

const solutions = [
  { icon: Brain, text: "5 IAs especializadas cuidam do que você odeia fazer" },
  { icon: TrendingUp, text: "Dashboard financeiro em tempo real — lucro real, não achismo" },
  { icon: ShoppingCart, text: "PDV, fiados e estoque integrados — zero planilha" },
  { icon: CheckCircle2, text: "Conteúdo para Instagram e WhatsApp gerado em segundos" },
]

export function ProblemSolution() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Problem Side */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-500 mb-3">O problema</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Você trabalha mais que o suficiente.<br />
                <span className="text-rose-500">Mas os resultados não aparecem.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Enquanto isso, as grandes consultoras usam tecnologia que você não tem acesso... Até agora.
              </p>
            </motion.div>

            <div className="space-y-3">
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className={`p-2.5 rounded-lg ${point.bg} ${point.color} shrink-0`}>
                    <point.icon className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-full min-h-[420px] rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 p-8 text-white flex flex-col justify-center overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold">
                ✨ A Solução Definitiva
              </div>

              <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                A Dona da Revenda é sua sócia que nunca descansa.
              </h3>

              <p className="text-lg text-emerald-50 leading-relaxed">
                Ela não dorme, não esquece e trabalha 24h por você. Deixe a IA cuidar do trabalho chato enquanto você foca no que importa: suas clientes.
              </p>

              <div className="space-y-3 pt-2">
                {solutions.map((sol, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <sol.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{sol.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
