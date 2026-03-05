"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Lock, Shield, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CtaFinal() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      router.push(`/signup?email=${encodeURIComponent(email)}&ref=landing`)
    }
  }

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-8 backdrop-blur border border-white/20">
            🚀 7 dias grátis — sem cartão de crédito agora
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Pare de trabalhar para sua revenda.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">
              Faça ela trabalhar para você.
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto font-light">
            Junte-se a centenas de revendedoras que já recuperaram 10+ horas por semana e dobraram suas vendas com IA.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-12">
            <Input
              type="email"
              placeholder="seu.melhor@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 px-5 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
            <Button
              type="submit"
              className="h-14 px-8 text-base font-bold rounded-xl bg-white text-indigo-900 hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] shrink-0"
            >
              {submitted ? "Conta criada! 🎉" : (
                <>Criar minha conta grátis <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-indigo-200">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> SSL Seguro
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Pagamento via Stripe
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> LGPD
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Garantia 7 dias
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
