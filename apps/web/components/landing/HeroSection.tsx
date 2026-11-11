"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, MessageCircle, Sparkles, Wallet, Package, Lock } from "lucide-react"
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

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.04] text-foreground">
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

        {/* Preview do sistema em janela estilo macOS */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[560px] pt-4 pb-10"
          aria-hidden
        >
          <div className="rounded-xl overflow-hidden bg-white border border-black/10 shadow-[0_30px_80px_-20px_rgba(42,18,24,0.35),0_8px_24px_-8px_rgba(42,18,24,0.18)] [color-scheme:light] text-brand-tinta">
            {/* Barra de título macOS */}
            <div className="relative flex items-center h-11 px-4 bg-gradient-to-b from-[#F7F5F3] to-[#EBE7E3] border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57] border border-[#E0443E]/60" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E] border border-[#DEA123]/60" />
                <span className="h-3 w-3 rounded-full bg-[#28C840] border border-[#1AAB29]/60" />
              </div>
              <div className="absolute inset-x-0 flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B5A5F] pointer-events-none">
                <Lock className="h-3 w-3" />
                donadarevenda.com.br
              </div>
            </div>

            {/* Conteúdo da janela */}
            <div className="p-5 sm:p-6 bg-brand-marfim/60">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-xl bg-white p-4 border border-brand-linho">
                  <p className="text-xs text-brand-vinho mb-1">Vendas Hoje</p>
                  <p className="text-2xl font-bold">R$ 845,00</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#2F7D5B]">
                    <TrendingUp className="h-3 w-3" /> 12% vs ontem
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 border border-brand-linho">
                  <p className="text-xs text-brand-vinho mb-1">Mensagens IA</p>
                  <p className="text-2xl font-bold">42</p>
                  <p className="mt-1 text-xs text-[#2F7D5B]">3 vendas fechadas</p>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-brand-linho p-4 min-h-[170px]">
                <p className="text-sm font-semibold mb-4">Atividade Recente</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 shrink-0 rounded-full bg-brand-quartzo-fundo text-brand-grena grid place-items-center">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Zara respondeu Maria</p>
                      <p className="text-xs text-brand-vinho">Venda de Kit Natura concluída</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 shrink-0 rounded-full bg-brand-quartzo-fundo text-brand-grena grid place-items-center">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Clara gerou 3 Reels</p>
                      <p className="text-xs text-brand-vinho">Prontos para postar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cartões flutuantes (do preview original) */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -right-1 sm:-right-8 -top-5 flex items-center gap-3 rounded-xl bg-white text-brand-tinta border border-black/10 shadow-xl p-3 sm:p-4 [color-scheme:light]"
          >
            <span className="h-10 w-10 rounded-full bg-[#E3F2EB] text-[#2F7D5B] grid place-items-center">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Venda Registrada</p>
              <p className="text-xs text-brand-vinho">R$ 150,00 via PDV</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute left-2 sm:-left-8 -bottom-1 flex items-center gap-3 rounded-xl bg-white text-brand-tinta border border-black/10 shadow-xl p-3 sm:p-4 [color-scheme:light]"
          >
            <span className="h-10 w-10 rounded-full bg-brand-quartzo-claro text-brand-grena grid place-items-center">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Alerta de Estoque</p>
              <p className="text-xs text-brand-vinho">Repor Hidratante Ekos</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
