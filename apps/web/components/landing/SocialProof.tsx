"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Maria Silva",
    role: "Consultora Natura Diamante",
    image: "https://i.pravatar.cc/150?img=32",
    text: "A Clara (IA) mudou minha vida. Eu passava horas tentando gravar vídeos pro Instagram e não vendia nada. Agora ela me dá o roteiro pronto, eu só gravo e posto. Minhas vendas aumentaram 340% em 90 dias!",
    metric: "+340% em vendas"
  },
  {
    name: "Ana Costa",
    role: "Revendedora O Boticário",
    image: "https://i.pravatar.cc/150?img=44",
    text: "Eu sempre perdia dinheiro com produtos vencendo no armário. A Nina me avisa meses antes e sugere a promoção certa. Deixei de perder uns R$ 2.000 por mês só com o controle de estoque.",
    metric: "Zero produtos vencidos"
  },
  {
    name: "Carolina Mendes",
    role: "Diretora de Vendas Mary Kay",
    image: "https://i.pravatar.cc/150?img=47",
    text: "O PDV e a gestão de fiados me salvou. Antes eu anotava tudo no papel e perdia controle. Agora em segundos registro uma venda, o cliente recebe a confirmação e eu sei exatamente o que está entrando.",
    metric: "Zero anotações em papel"
  }
]

const stats = [
  { value: "R$ 2.4M+", label: "em vendas gerenciadas" },
  { value: "500+", label: "revendedoras ativas" },
  { value: "5 IAs", label: "sempre trabalhando para você" },
  { value: "94%", label: "de satisfação" },
]

export function SocialProof() {
  return (
    <section className="py-24 bg-gray-900 dark:bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-b border-gray-800 pb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">Depoimentos</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Histórias reais de sucesso
          </h2>
          <p className="text-xl text-gray-400">
            Não acredite apenas em nós. Veja o que as donas da revenda estão dizendo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 dark:bg-gray-900 rounded-3xl p-8 border border-gray-700 flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-8 flex-1">
                &quot;{t.text}&quot;
              </p>

              <div className="flex items-center gap-4 pt-5 border-t border-gray-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full" />
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                ✓ {t.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
