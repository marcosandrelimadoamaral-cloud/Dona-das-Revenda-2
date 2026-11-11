"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, PackageSearch, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container mx-auto px-4 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-7"
        >
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-quartzo-claro text-brand-grena px-4 py-1.5 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Nova: Agente IA que cria Reels que viralizam
          </p>

          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Sua revenda de cosméticos no <span className="text-primary">piloto automático com IA</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            PDV, financeiro, estoque, fiados e 5 agentes de IA — tudo em um só lugar. Gerencia sua revenda enquanto você foca
            em crescer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild size="lg" className="h-14 px-8 text-base rounded-xl shadow-soft hover:shadow-lift transition-shadow">
              <Link href="/signup?ref=landing">
                Testar Grátis por 7 Dias <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-xl border-primary/30 text-primary hover:bg-brand-quartzo-fundo"
            >
              <Link href="#agentes">Conhecer os agentes de IA</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[520px]"
          aria-hidden
        >
          <div className="rounded-3xl bg-white border border-border shadow-lift p-6 [color-scheme:light] text-brand-tinta">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-2xl bg-brand-marfim p-4">
                <p className="text-xs text-brand-vinho mb-1">Vendas Hoje</p>
                <p className="text-2xl font-bold">R$ 845,00</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#2F7D5B]">
                  <TrendingUp className="h-3 w-3" /> 12% vs ontem
                </p>
              </div>
              <div className="rounded-2xl bg-brand-marfim p-4">
                <p className="text-xs text-brand-vinho mb-1">Mensagens IA</p>
                <p className="text-2xl font-bold">42</p>
                <p className="mt-1 text-xs text-[#2F7D5B]">3 vendas fechadas</p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-linho">
              <p className="px-4 pt-4 pb-2 text-sm font-semibold">Atividade Recente</p>
              <div className="divide-y divide-brand-linho">
                {[
                  { icon: MessageCircle, t: "Zara respondeu Maria", s: "Venda de Kit Natura concluída" },
                  { icon: Sparkles, t: "Clara gerou 3 Reels", s: "Prontos para postar" },
                  { icon: PackageSearch, t: "Alerta de Estoque", s: "Repor Hidratante Ekos" },
                ].map(({ icon: Icon, t, s }) => (
                  <div key={t} className="flex items-center gap-3 p-3.5">
                    <span className="h-9 w-9 shrink-0 rounded-full bg-brand-quartzo-fundo text-brand-grena grid place-items-center">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t}</p>
                      <p className="text-xs text-brand-vinho truncate">{s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -z-10 -bottom-5 -right-5 h-full w-full rounded-3xl bg-brand-quartzo-claro" />
        </motion.div>
      </div>
    </section>
  )
}
