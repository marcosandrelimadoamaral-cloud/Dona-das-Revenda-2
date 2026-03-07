"use client"

import { motion } from "framer-motion"
import { Play, MousePointer2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white dark:bg-gray-950">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-pink-500/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-orange-500/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          {/* MOBILE CRO HEADER COPIES */}
          <div className="flex md:hidden items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 font-bold tracking-wide animate-pulse">
              🚨 Pare de Perder Dinheiro
            </Badge>
          </div>

          <h1 className="md:hidden text-4xl font-extrabold tracking-tight leading-[1.1]">
            Adeus fiados e <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">desorganização.</span>
          </h1>

          <p className="md:hidden text-lg text-muted-foreground leading-relaxed">
            O único app que organiza clientes, vendas e cobra fiados no automático com IA inteligente.
          </p>

          {/* DESKTOP ORIGINAL HEADER COPIES */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 px-3 py-1 animate-pulse">
              🚀 Nova: Agente IA que cria Reels que viralizam
            </Badge>
          </div>

          <h1 className="hidden md:block text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Sua revenda de cosméticos no <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">piloto automático com IA</span>
          </h1>

          <p className="hidden md:block text-xl text-muted-foreground max-w-xl leading-relaxed">
            PDV, financeiro, estoque, fiados e 5 agentes de IA — tudo em um só lugar. Gerencia sua revenda enquanto você foca em crescer.
          </p>

          {/* BUTTONS (Both) */}
          <div className="flex flex-col md:flex-row w-full mt-4 sm:mt-8 gap-3 relative z-20 md:w-auto">
            {/* Mobile Extreme CRO Button */}
            <Button asChild size="lg" className="md:hidden w-full h-16 text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-[0_8px_30px_rgb(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl cursor-pointer">
              <Link href="/signup?ref=landing">
                Assinar Agora com 7 Dias Grátis
              </Link>
            </Button>

            {/* Desktop Original Button */}
            <Button asChild size="lg" className="hidden md:flex h-14 px-8 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all rounded-xl cursor-pointer">
              <Link href="/signup?ref=landing">
                Testar Grátis por 7 Dias
              </Link>
            </Button>

            {/* Social Proof Progressivo (Somente Mobile) */}
            <div className="md:hidden flex flex-col items-center justify-center gap-1 mt-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
                <span className="font-bold text-base ml-1 text-gray-800 dark:text-gray-200">5.0</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                Aprovado por <strong>+500</strong> revendedoras de sucesso.
              </span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full md:w-auto md:h-14 md:px-8 h-14 text-base rounded-2xl md:rounded-xl border-2 active:bg-gray-100 dark:active:bg-gray-900 transition-colors">
                  <Play className="mr-2 h-5 w-5 text-indigo-600 md:text-black md:dark:text-white" /> Ver demonstração <span className="hidden md:inline">em 2 min</span><span className="md:hidden">na prática</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black/95 border-0">
                <div className="aspect-video w-full flex flex-col items-center justify-center bg-gray-900 text-white">
                  <Play className="w-16 h-16 text-indigo-500 mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold mb-2">Vídeo de Demonstração</h3>
                  <p className="text-gray-400">Em breve...</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative block perspective-1000 mt-8 lg:mt-0"
        >
          <div className="relative w-full aspect-square max-w-[600px] mx-auto transform-3d rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 scale-90 sm:scale-100 origin-center lg:origin-right">
            {/* Main Dashboard Mockup — forced ALWAYS LIGHT (it's a UI simulation) */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col [color-scheme:light]">
              <div className="h-12 border-b bg-gray-50 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="p-6 flex-1 bg-gray-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Vendas Hoje</div>
                    <div className="text-2xl font-bold text-gray-900">R$ 845,00</div>
                    <div className="text-xs text-emerald-600 mt-1">↑ 12% vs ontem</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Mensagens IA</div>
                    <div className="text-2xl font-bold text-gray-900">42</div>
                    <div className="text-xs text-emerald-600 mt-1">3 vendas fechadas</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-48 flex flex-col">
                  <div className="text-sm font-medium text-gray-800 mb-4">Atividade Recente</div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">🤖</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">Zara respondeu Maria</div>
                        <div className="text-xs text-gray-500">Venda de Kit Natura concluída</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs">✨</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">Clara gerou 3 Reels</div>
                        <div className="text-xs text-gray-500">Prontos para postar</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card 1 — FORCED LIGHT MODE always */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-4 sm:-right-12 top-10 sm:top-20 bg-white text-gray-900 p-3 sm:p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 scale-90 sm:scale-100"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                💰
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Venda Registrada</div>
                <div className="text-xs text-gray-500">R$ 150,00 via PDV</div>
              </div>
            </motion.div>

            {/* Floating card 2 — FORCED LIGHT MODE always */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -left-2 sm:-left-8 bottom-20 sm:bottom-32 bg-white text-gray-900 p-3 sm:p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 scale-90 sm:scale-100"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                📦
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Alerta de Estoque</div>
                <div className="text-xs text-gray-500">Repor Hidratante Ekos</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-muted-foreground">
        <MousePointer2 className="w-6 h-6 mb-2" />
        <span className="text-xs font-medium uppercase tracking-widest">Role para descobrir</span>
      </div>
    </section>
  )
}
