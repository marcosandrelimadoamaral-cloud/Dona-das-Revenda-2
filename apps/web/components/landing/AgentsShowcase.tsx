"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, TrendingUp, MessageCircle, Package, Calendar, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { generateDemoContent } from "@/app/actions/ai/generateDemoContent"
import Link from "next/link"

const agents = [
  {
    id: "clara",
    name: "Clara",
    role: "Criadora de Conteúdo",
    icon: Sparkles,
    color: "bg-pink-500",
    textColor: "text-pink-500",
    superpower: "Cria 30 dias de conteúdo em 5 minutos",
    preview: {
      input: "Creme anti-idade Natura Chronos",
      output: "✨ HOOK: Pare de gastar rios de dinheiro com botox! Descobri o segredo das dermatologistas...\n\n🎥 B-ROLL: Mostrando a textura do creme na mão\n\n💬 CTA: Comente 'EU QUERO' que te mando o link com 20% OFF!"
    },
    cta: "Ver exemplo de roteiro"
  },
  {
    id: "finn",
    name: "Finn",
    role: "CFO Virtual",
    icon: TrendingUp,
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    superpower: "Prevê seu caixa dos próximos 30 dias",
    preview: {
      input: "Analisar fluxo de caixa",
      output: "⚠️ ALERTA: Você vai ficar sem dinheiro dia 15 se não vender R$ 500 até lá.\n\n💡 SUGESTÃO: Faça uma promoção do kit de Dia das Mães que está parado no estoque."
    },
    cta: "Ver análise demo"
  },
  {
    id: "zara",
    name: "Zara",
    role: "Vendas WhatsApp",
    icon: MessageCircle,
    color: "bg-cyan-500",
    textColor: "text-cyan-500",
    superpower: "Atende, qualifica e fecha vendas automático",
    preview: {
      input: "Cliente: Oi, tem o perfume Lily?",
      output: "Zara: Oi Ana! Temos sim, a pronta entrega. Vi que você comprou o hidratante mês passado, quer aproveitar e levar o kit completo com 15% de desconto? 💧"
    },
    cta: "Testar conversa"
  },
  {
    id: "nina",
    name: "Nina",
    role: "Gestão de Estoque",
    icon: Package,
    color: "bg-orange-500",
    textColor: "text-orange-500",
    superpower: "Prevê rupturas e sugere reposição",
    preview: {
      input: "Verificar estoque crítico",
      output: "📦 Você vai ficar sem Hidratante Ekos em 5 dias. O Ciclo Natura 12 começa segunda, compre agora com 30% off para garantir sua margem!"
    },
    cta: "Ver previsões"
  },
  {
    id: "lia",
    name: "Lia",
    role: "Assistente Pessoal",
    icon: Calendar,
    color: "bg-purple-500",
    textColor: "text-purple-500",
    superpower: "Organiza seu dia e otimiza rotas",
    preview: {
      input: "Resumo do dia",
      output: "Bom dia! Hoje você tem 3 entregas na Zona Sul. Rota otimizada: Maria → Ana → Joana.\n\n🎂 Ah, é aniversário da cliente Carla, já deixei uma mensagem pronta para você enviar!"
    },
    cta: "Ver briefing"
  }
]

export function AgentsShowcase() {
  const [activeAgent, setActiveAgent] = useState(agents[0])
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isUpgradeRequired, setIsUpgradeRequired] = useState(false)

  // Demo States
  const [isLoading, setIsLoading] = useState(false)
  const [demoResult, setDemoResult] = useState<any>(null)

  // Clara Inputs
  const [claraProduct, setClaraProduct] = useState("Hidratante Natura Ekos")

  // Finn Inputs
  const [finnCost, setFinnCost] = useState("45,00")
  const [finnPrice, setFinnPrice] = useState("89,90")
  const [finnQty, setFinnQty] = useState("10")

  // Zara Inputs
  const [zaraMessage, setZaraMessage] = useState("Quero um hidratante anti-idade")

  const openDemo = (agentId: string) => {
    const hasUsed = localStorage.getItem(`demo_agent_${agentId}`)
    if (hasUsed) {
      setIsUpgradeRequired(true)
    } else {
      setIsDemoOpen(true)
      setDemoResult(null)
    }
  }

  const runDemo = async () => {
    setIsLoading(true)
    setDemoResult(null)

    let inputData = {}

    if (activeAgent.id === 'clara') inputData = { product: claraProduct }
    if (activeAgent.id === 'finn') inputData = { cost: finnCost, price: finnPrice, qty: finnQty }
    if (activeAgent.id === 'zara') inputData = { message: zaraMessage }

    const result = await generateDemoContent(activeAgent.id, inputData)

    setIsLoading(false)
    if (result.success) {
      setDemoResult(result.data)
      localStorage.setItem(`demo_agent_${activeAgent.id}`, 'true')
    } else {
      setDemoResult({ error: result.error })
    }
  }

  return (
    <section id="agentes" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Conheça seu novo time de funcionários que nunca dormem
          </h2>
          <p className="text-xl text-muted-foreground">
            5 especialistas de IA trabalhando para você, pelo preço de um lanche
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Tabs */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setActiveAgent(agent)
                  setDemoResult(null)
                }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all text-left ${activeAgent.id === agent.id
                  ? "bg-gray-100 dark:bg-gray-800 shadow-sm border-l-4 border-l-primary"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900 border-l-4 border-l-transparent"
                  }`}
              >
                <div className={`p-2 rounded-lg text-white ${agent.color}`}>
                  <agent.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">{agent.name}</div>
                  <div className="text-sm text-muted-foreground">{agent.role}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAgent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border dark:border-gray-800 shadow-sm h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl text-white ${activeAgent.color}`}>
                    <activeAgent.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{activeAgent.name}</h3>
                    <Badge variant="secondary" className={`mt-1 ${activeAgent.textColor} bg-white border`}>
                      {activeAgent.superpower}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border dark:border-gray-700 shadow-inner space-y-6">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Como funciona</div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm font-medium">
                      {activeAgent.preview.input}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resposta da IA</div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-4 rounded-lg text-sm border border-indigo-100 dark:border-indigo-900 whitespace-pre-wrap leading-relaxed">
                      {activeAgent.preview.output}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => openDemo(activeAgent.id)}
                    className={`${activeAgent.color} hover:opacity-90 text-white shadow-md`}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {activeAgent.cta}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upgrade Required Modal */}
      <Dialog open={isUpgradeRequired} onOpenChange={setIsUpgradeRequired}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Limite de Teste Atingido</DialogTitle>
            <DialogDescription className="text-center text-lg mt-2">
              Você já experimentou a magia da <b>{activeAgent.name}</b>! Crie sua conta gratuita agora e libere acesso completo a todos os 5 agentes IA. 🚀
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button asChild size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
              <Link href="/signup?ref=agent_limit">
                Criar conta gratuita
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interactive Demo Modals */}
      <Dialog open={isDemoOpen} onOpenChange={(open) => {
        if (!open) { setDemoResult(null); setIsLoading(false) }
        setIsDemoOpen(open)
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <activeAgent.icon className={`w-6 h-6 ${activeAgent.textColor}`} />
              Testando a {activeAgent.name}
            </DialogTitle>
            <DialogDescription>
              A inteligência artificial que {activeAgent.superpower.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Form Fields Based on Agent */}
            {!demoResult && !isLoading && (
              <div className="space-y-4">
                {activeAgent.id === 'clara' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Qual produto você quer vender?</label>
                    <Input
                      value={claraProduct}
                      onChange={(e) => setClaraProduct(e.target.value)}
                      placeholder="Ex: Hidratante Natura Ekos"
                    />
                  </div>
                )}

                {activeAgent.id === 'finn' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custo (R$)</label>
                      <Input value={finnCost} onChange={(e) => setFinnCost(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preço (R$)</label>
                      <Input value={finnPrice} onChange={(e) => setFinnPrice(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Qtd/mês</label>
                      <Input value={finnQty} onChange={(e) => setFinnQty(e.target.value)} />
                    </div>
                  </div>
                )}

                {activeAgent.id === 'zara' && (
                  <div className="space-y-2">
                    <div className="bg-cyan-50 border border-cyan-100 p-3 rounded-lg text-sm mb-4">
                      <b>Zara:</b> Oi! Sou a Zara, sua consultora virtual. Como posso te ajudar hoje? 💄
                    </div>
                    <label className="text-sm font-medium">Sua mensagem:</label>
                    <Input
                      value={zaraMessage}
                      onChange={(e) => setZaraMessage(e.target.value)}
                      placeholder="Digite como se fosse um cliente..."
                    />
                  </div>
                )}

                {(activeAgent.id === 'nina' || activeAgent.id === 'lia') && (
                  <div className="bg-gray-50 border p-4 rounded-xl text-center text-gray-500">
                    Clique no botão abaixo para {activeAgent.id === 'nina' ? 'gerar uma análise do seu estoque virtual.' : 'ver sua agenda e tarefas simuladas.'}
                  </div>
                )}

                <Button onClick={runDemo} className={`w-full ${activeAgent.color} text-white`}>
                  {activeAgent.id === 'clara' ? 'Gerar Roteiro' :
                    activeAgent.id === 'finn' ? 'Analisar Lucro' :
                      activeAgent.id === 'zara' ? 'Enviar' :
                        activeAgent.id === 'nina' ? 'Analisar Estoque' : 'Ver Briefing de Hoje'}
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className={`w-12 h-12 animate-spin ${activeAgent.textColor}`} />
                <p className="font-medium text-gray-600 animate-pulse">A {activeAgent.name} está pensando...</p>
              </div>
            )}

            {/* Results */}
            {demoResult && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {demoResult.error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                    {demoResult.error}
                  </div>
                )}

                {/* Clara Result */}
                {activeAgent.id === 'clara' && demoResult.hook && (
                  <>
                    <div className="p-4 bg-gray-50 border rounded-xl space-y-3">
                      <div><Badge className="bg-pink-100 text-pink-700 border-0 mb-1">Hook</Badge><p className="text-sm">{demoResult.hook}</p></div>
                      <div><Badge className="bg-purple-100 text-purple-700 border-0 mb-1">Roteiro</Badge><p className="text-sm">{demoResult.script}</p></div>
                      <div><Badge className="bg-blue-100 text-blue-700 border-0 mb-1">Legenda Instagram</Badge><p className="text-sm whitespace-pre-wrap">{demoResult.caption}</p></div>
                    </div>
                  </>
                )}

                {/* Finn Result */}
                {activeAgent.id === 'finn' && demoResult.margin && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                        <div className="text-sm text-emerald-700 font-medium">Margem Real</div>
                        <div className="text-3xl font-bold text-emerald-900">{demoResult.margin}%</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                        <div className="text-sm text-blue-700 font-medium">Lucro Estimado (mês)</div>
                        <div className="text-3xl font-bold text-blue-900">R$ {demoResult.profit}</div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-900">
                      <b>💡 Conselho do Finn:</b> {demoResult.suggestion}
                    </div>
                  </div>
                )}

                {/* Zara Result */}
                {activeAgent.id === 'zara' && demoResult.reply && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-sm ml-8 text-sm text-right">
                      {zaraMessage}
                    </div>
                    <div className="bg-cyan-50 border border-cyan-100 p-3 rounded-2xl rounded-tl-sm mr-8 text-sm">
                      <b>Zara:</b> {demoResult.reply}
                    </div>
                  </div>
                )}

                {/* Nina Result */}
                {activeAgent.id === 'nina' && demoResult.alerts && (
                  <div className="space-y-4">
                    {demoResult.alerts.map((alert: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-sm">{alert.product}</span>
                        </div>
                        <Badge variant="destructive">{alert.action}</Badge>
                      </div>
                    ))}
                    <div className="p-3 bg-orange-50 text-orange-800 rounded-lg text-sm border border-orange-200">
                      <b>Sugestão de Reposição:</b> {demoResult.recommendation}
                    </div>
                  </div>
                )}

                {/* Lia Result */}
                {activeAgent.id === 'lia' && demoResult.tasks && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-purple-900 bg-purple-100 px-3 py-1 rounded inline-block">Agenda do Dia</h4>
                    {demoResult.tasks.map((task: any, i: number) => (
                      <div key={i} className="flex gap-3 text-sm p-3 border rounded-lg bg-white shadow-sm">
                        <span className="font-bold text-gray-500">{task.time}</span>
                        <span>{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex justify-between gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => { setDemoResult(null); setIsDemoOpen(false) }}>
                    Fechar
                  </Button>
                  <Button asChild className={`flex-1 ${activeAgent.color} hover:opacity-90`}>
                    <Link href="/signup">
                      Ter minha {activeAgent.name}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
