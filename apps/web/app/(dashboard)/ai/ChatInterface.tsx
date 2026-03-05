"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, TrendingUp, PackageSearch, MessageCircle, CalendarCheck, User, Box, ArrowRight, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendMessage } from "@/app/actions/ai/sendMessage"
import { getUserProducts } from "@/app/actions/inventory/getProducts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const AGENTS = [
    { id: 'clara', name: 'Clara', role: 'Marketing & Conteúdo', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/40', greeting: 'Oi! Sou a Clara. Vamos criar uma campanha que vai bombar no seu Instagram hoje?' },
    { id: 'finn', name: 'Finn', role: 'Analista Financeiro', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/40', greeting: 'Olá. Finn aqui. Pronto para analisarmos as margens e garantir que você não está perdendo dinheiro?' },
    { id: 'zara', name: 'Zara', role: 'Treinadora de Vendas', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40', greeting: 'Ei! A cliente achou caro? Me mande o que ela falou que eu te dou a resposta perfeita para fechar essa venda.' },
    { id: 'nina', name: 'Nina', role: 'Gestão de Estoque', icon: PackageSearch, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/40', greeting: 'Produto parado é dinheiro jogado fora! Quer ajuda para montar uns kits com aquele estoque antigo?' },
    { id: 'lia', name: 'Lia', role: 'Secretária Executiva', icon: CalendarCheck, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/40', greeting: 'Bom dia! Sou a Lia. Posso te ajudar a organizar seu dia ou cobrar aquele fiado atrasado de forma bem educada.' }
]

export function ChatInterface({ settings }: { settings: any }) {
    const [activeAgent, setActiveAgent] = useState('clara')
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent', content: string, agentId?: string }>>([])
    const [isLoading, setIsLoading] = useState(false)

    const [products, setProducts] = useState<any[]>([])
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Carregar produtos para servir de contexto
        getUserProducts().then(res => {
            if (res.data) setProducts(res.data)
        })
    }, [])

    useEffect(() => {
        // Adicionar mensagem de boas vindas ao trocar de agente
        const agent = AGENTS.find(a => a.id === activeAgent)
        if (agent) {
            setMessages([{ role: 'agent', content: agent.greeting, agentId: agent.id }])
            setSelectedProduct(null) // limpar contexto ao trocar
        }
    }, [activeAgent])

    useEffect(() => {
        // Rolar para o final
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setIsLoading(true)

        const response = await sendMessage(activeAgent, userMsg, selectedProduct)

        setIsLoading(false)
        if (response.error) {
            setMessages(prev => [...prev, { role: 'agent', content: `**Erro:** ${response.error}`, agentId: activeAgent }])
        } else if (response.response) {
            setMessages(prev => [...prev, { role: 'agent', content: response.response, agentId: activeAgent }])
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const currentAgent = AGENTS.find(a => a.id === activeAgent)!

    return (
        <div className="flex h-full">
            {/* Sidebar - Agent Selection */}
            <div className="w-64 border-r bg-gray-50/50 dark:bg-gray-900/50 hidden md:flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-lg">Central de IA</h2>
                    <p className="text-xs text-muted-foreground">Especialistas à disposição</p>
                </div>
                <div className="p-3 space-y-1 flex-1 overflow-y-auto">
                    {AGENTS.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => setActiveAgent(agent.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${activeAgent === agent.id
                                ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${agent.bg}`}>
                                <agent.icon className={`w-5 h-5 ${agent.color}`} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm truncate dark:text-gray-200">{agent.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{agent.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t text-xs text-center text-muted-foreground">
                    Usando modelo: Gemini 3.1 Pro
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950">
                <div className="h-14 border-b flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 md:hidden rounded-full flex items-center justify-center ${currentAgent.bg}`}>
                            <currentAgent.icon className={`w-4 h-4 ${currentAgent.color}`} />
                        </div>
                        <div>
                            <h2 className="font-semibold flex items-center gap-2">
                                {currentAgent.name}
                                <Badge variant="secondary" className="text-[10px] h-5 bg-green-100 text-green-700 hover:bg-green-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse" /> Online
                                </Badge>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6" ref={scrollRef}>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2.5 sm:gap-4 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'agent' && (
                                    <Avatar className="w-8 h-8 border shrink-0">
                                        <AvatarFallback className={currentAgent.bg}>
                                            <currentAgent.icon className={`w-4 h-4 ${currentAgent.color}`} />
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm border border-transparent ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl rounded-br-md shadow-purple-500/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-3xl rounded-tl-md border-gray-100 dark:border-gray-700 shadow-black/5'
                                    }`}>
                                    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <Avatar className="w-8 h-8 border shrink-0 hidden sm:block">
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"><User className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-4 justify-start animate-in fade-in">
                                <Avatar className="w-8 h-8 border shrink-0">
                                    <AvatarFallback className={currentAgent.bg}>
                                        <currentAgent.icon className={`w-4 h-4 ${currentAgent.color} animate-pulse`} />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800/50 shadow-sm rounded-3xl rounded-tl-md px-5 py-4 flex items-center gap-2">
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">Analisando seus dados reais...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-950 border-t">
                    <div className="max-w-3xl mx-auto">
                        {/* Contexto RAG */}
                        {selectedProduct && (
                            <div className="mb-3 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                                <Box className="w-3.5 h-3.5" />
                                <span>Contexto Ativo: <b>{selectedProduct.custom_name}</b></span>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100"
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        <div className="flex items-end gap-2 relative">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0 rounded-full w-10 h-10" title="Anexar Produto">
                                        <Box className="w-4 h-4 text-gray-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-0" align="start">
                                    <div className="p-2 border-b">
                                        <p className="text-xs font-medium text-muted-foreground">Vincular Produto da Loja</p>
                                    </div>
                                    <ScrollArea className="h-48">
                                        <div className="p-1">
                                            {products.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => setSelectedProduct(p)}
                                                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 truncate"
                                                >
                                                    {p.custom_name}
                                                </button>
                                            ))}
                                            {products.length === 0 && <p className="text-xs text-center p-4 text-muted-foreground">Nenhum produto em estoque.</p>}
                                        </div>
                                    </ScrollArea>
                                </PopoverContent>
                            </Popover>

                            <div className="relative flex-1">
                                <Input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Pergunte algo para a ${currentAgent.name}...`}
                                    className="pr-12 rounded-2xl h-12 bg-gray-50 dark:bg-gray-900 border-transparent focus-visible:ring-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1.5 top-1.5 w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Sugestões de Prompts Rápidos */}
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                            {activeAgent === 'clara' && (
                                <>
                                    <PromptBadge onClick={() => setInput("Crie um roteiro de Reels persuasivo para vender mais neste final de semana.")} text="Ideias de Reels de Venda" />
                                    <PromptBadge onClick={() => setInput("Escreva uma legenda curta e focada em fechamento para o Instagram.")} text="Legenda Curta Instagram" />
                                </>
                            )}
                            {activeAgent === 'finn' && (
                                <>
                                    <PromptBadge onClick={() => setInput("Baseado nas minhas vendas reais, como está meu faturamento e lucro esse mês?")} text="Analisar meu Faturamento" />
                                    <PromptBadge onClick={() => setInput("Qual o risco atual do meu 'fiado' com base nas vendas pendentes?")} text="Risco de Fiado" />
                                </>
                            )}
                            {activeAgent === 'zara' && (
                                <>
                                    <PromptBadge onClick={() => setInput("Simule ser uma cliente que achou meu produto caro. Quero treinar responder.")} text="Treinar Objeção de Preço" />
                                    <PromptBadge onClick={() => setInput("Com base no que sabe da loja, crie um script pro-ativo de WhatsApp para enviar aos clientes VIP.")} text="Mensagem Clientes VIP" />
                                </>
                            )}
                            {activeAgent === 'nina' && (
                                <>
                                    <PromptBadge onClick={() => setInput("Quais são os produtos do meu estoque real que estão encalhados e precisam sair logo?")} text="Lista de Encalhados" />
                                    <PromptBadge onClick={() => setInput("Me sugira 2 combos/kits usando meu estoque atual.")} text="Sugerir Kits Rápidos" />
                                </>
                            )}
                        </div>

                        {/* Personalize tip */}
                        <div className="hidden sm:flex mt-3 items-center gap-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 rounded-xl px-3 py-2">
                            <Settings2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <p className="text-xs text-purple-700 dark:text-purple-300 flex-1">
                                <span className="font-semibold">Personalize sua experiência</span> — adicione contexto da sua loja para respostas mais precisas.
                            </p>
                            <a
                                href="/settings?tab=ai"
                                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline shrink-0"
                            >
                                Configurar →
                            </a>
                        </div>

                        {/* Legal Disclaimer */}
                        <div className="mt-3 text-center hidden sm:block">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                {currentAgent.name} é uma Inteligência Artificial e pode cometer erros. Verifique as informações.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PromptBadge({ text, onClick }: { text: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="shrink-0 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs text-gray-600 dark:text-gray-300 hover:border-purple-300 hover:text-purple-600 transition-colors whitespace-nowrap"
        >
            <ArrowRight className="w-3 h-3 inline mr-1 opacity-50" />
            {text}
        </button>
    )
}
