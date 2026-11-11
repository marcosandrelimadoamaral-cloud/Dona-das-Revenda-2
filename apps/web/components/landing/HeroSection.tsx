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
          <p className="inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-ouro-escuro">
            <span className="h-px w-8 bg-brand-ouro" aria-hidden />
            Gestão para quem revende beleza
          </p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.04] text-foreground">
            Sua revenda organizada. <span className="text-primary">Seu tempo de volta.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Vendas, estoque, fiados e clientes num só lugar, com cinco assistentes de IA que trabalham com você. Para quem
            revende Natura, Avon, Boticário e outras marcas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild size="lg" className="h-14 px-8 text-base rounded-xl shadow-soft hover:shadow-lift transition-shadow">
              <Link href="/signup?ref=landing">
                Começar 7 dias grátis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-xl border-primary/30 text-primary hover:bg-brand-quartzo-fundo"
            >
              <Link href="#agentes">Conhecer os assistentes</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Cancele quando quiser. Sem fidelidade.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[520px]"
          aria-hidden
        >
          <div className="rounded-3xl bg-white border border-border shadow-lift p-6 [color-scheme:light] text-brand-tinta">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-vinho">Hoje</p>
                <p className="font-display text-2xl font-semibold">Resumo da revenda</p>
              </div>
              <span className="h-9 w-9 rounded-full bg-brand-quartzo-claro text-brand-grena grid place-items-center text-sm font-semibold">
                M
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-2xl bg-brand-marfim p-4">
                <p className="text-xs text-brand-vinho mb-1">Vendas do dia</p>
                <p className="font-display text-2xl font-semibold">R$ 845,00</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#2F7D5B]">
                  <TrendingUp className="h-3 w-3" /> acima de ontem
                </p>
              </div>
              <div className="rounded-2xl bg-brand-marfim p-4">
                <p className="text-xs text-brand-vinho mb-1">A receber (fiados)</p>
                <p className="font-display text-2xl font-semibold">R$ 320,00</p>
                <p className="mt-1 text-xs text-brand-vinho">3 clientes</p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-linho divide-y divide-brand-linho">
              {[
                { icon: MessageCircle, t: "Zara preparou 3 respostas", s: "Clientes aguardando no WhatsApp" },
                { icon: Sparkles, t: "Clara sugeriu 2 posts", s: "Com base no seu estoque" },
                { icon: PackageSearch, t: "Nina avisa: repor Hidratante", s: "Restam 2 unidades" },
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
          <div className="absolute -z-10 -bottom-5 -right-5 h-full w-full rounded-3xl bg-brand-quartzo-claro" />
        </motion.div>
      </div>
    </section>
  )
}
