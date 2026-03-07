"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createMPSubscription } from "@/app/actions/billing/createMPSubscription"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, Lock, ArrowLeft, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

const PLANS = {
    monthly: {
        id: "monthly" as const,
        name: "O Cauteloso",
        cycle: "Mensal",
        price: "97,00",
        billing: "Cobrado mensalmente",
        features: ["5 Agentes de IA incluídos", "Catálogo multi-marca ilimitado", "PDV, Fiados e Estoque", "Dashboard Financeiro completo", "Relatórios Excel"],
        popular: false,
    },
    annual: {
        id: "annual" as const,
        name: "VIP Anual",
        cycle: "Anual",
        price: "47,50",
        billing: "Cobrado R$ 570 uma vez por ano",
        features: ["Tudo do plano mensal", "Economia livre de R$ 594", "Suporte VIP com prioridade", "IA no WhatsApp (acesso antecipado)", "Funcionalidades em primeira mão"],
        popular: true,
    },
    quarterly: {
        id: "quarterly" as const,
        name: "O Equilíbrio",
        cycle: "Trimestral",
        price: "87,00",
        billing: "R$ 261 a cada 3 meses",
        features: ["Tudo do plano mensal", "10% de desconto", "Renovação automática a cada 90 dias"],
        popular: false,
    },
}

// CheckoutRedirector — fetches init_point and redirects to Mercado Pago
function CheckoutRedirector({ planId }: { planId: keyof typeof PLANS }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Fetch the Mercado Pago init_point URL
        createMPSubscription(planId).then((res) => {
            if (res?.success && res.init_point) {
                // Redirect user explicitly to checkout pro
                window.location.href = res.init_point
            } else {
                setError(res?.error || "Erro ao gerar link de pagamento seguro.")
                setLoading(false)
            }
        }).catch((err: any) => {
            console.error("MPCheckoutActionError:", err)
            setError(`Erro técnico detalhado: ${err?.message || String(err)}`)
            setLoading(false)
        })
    }, [planId])

    if (error) return (
        <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.back()} variant="outline">Voltar aos planos</Button>
        </div>
    )

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-muted-foreground font-semibold text-lg">Redirecionando para ambiente seguro...</p>
            <p className="text-muted-foreground text-xs">Você será levado ao Checkout Oficial do Mercado Pago</p>
        </div>
    )
}

// Plan selector step
function PlanSelector({ onSelect }: { onSelect: (planId: keyof typeof PLANS) => void }) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Escolha seu plano</h2>
                <p className="text-muted-foreground text-sm">Cancele quando quiser. Sem taxas ocultas.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {(Object.values(PLANS) as (typeof PLANS[keyof typeof PLANS])[]).map(plan => (
                    <div
                        key={plan.id}
                        className={`relative bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col transition-all overflow-hidden ${plan.popular
                            ? "ring-2 ring-indigo-600 dark:ring-indigo-500 shadow-xl z-10 border-indigo-100 dark:border-indigo-900"
                            : "border-gray-200 dark:border-gray-700"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap">
                                <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-4 py-1.5 text-xs font-bold shadow-md rounded-t-none rounded-b-xl">
                                    🔥 OFERTA: 51% OFF + 7 DIAS GRÁTIS
                                </Badge>
                            </div>
                        )}

                        <div className={`mt-${plan.popular ? '4' : '0'}`}>
                            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                            <p className="inline-block text-xs font-bold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase mb-3 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-md">{plan.cycle}</p>
                        </div>

                        <div className="mb-6">
                            {plan.popular && (
                                <p className="text-sm font-bold text-red-500 line-through decoration-red-500/50 mb-1">De R$ 97,00/mês</p>
                            )}
                            <div className={`flex items-baseline gap-1 ${plan.popular ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                <span className="text-4xl md:text-5xl font-extrabold">R$ {plan.price}</span>
                                <span className="text-muted-foreground font-medium">/mês</span>
                            </div>
                            <div className={`text-sm font-bold mt-2 leading-tight ${plan.popular ? 'text-emerald-600' : 'text-gray-500'}`}>
                                {plan.billing}
                            </div>
                        </div>

                        <Button
                            onClick={() => onSelect(plan.id)}
                            className={`w-full mb-6 h-14 rounded-xl text-base md:text-lg font-bold cursor-pointer transition-all ${plan.popular
                                ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-[0_4px_14px_rgb(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgb(239,68,68,0.4)]"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                                }`}
                        >
                            {plan.popular ? "Garantir 51% de Desconto" : `Assinar ${plan.cycle}`}
                        </Button>

                        <div className="space-y-3 flex-1">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-indigo-600' : 'text-emerald-500'}`} />
                                    <span className={`text-sm font-medium ${plan.popular ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CheckoutContent() {
    const searchParams = useSearchParams()
    const planParam = searchParams.get("plan") as keyof typeof PLANS | null
    const isNewUser = searchParams.get("newUser") === "true"
    const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS | null>(
        planParam && PLANS[planParam] ? planParam : null
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 flex flex-col">
            {/* Header */}
            <header className="border-b dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image src="/logo-transparent.png" alt="Dona da Revenda" width={56} height={56} className="object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dona da</span>
                            <span className="font-black text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Revenda</span>
                        </div>
                    </Link>
                    <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao site
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-4 py-2 rounded-full mb-4">
                            <Sparkles className="w-3.5 h-3.5" /> Ative sua conta — 7 dias grátis
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {selectedPlan ? "Confirme seu pagamento" : "Escolha seu plano"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {selectedPlan
                                ? "Seus dados são protegidos com criptografia de nível bancário."
                                : "Todos os planos incluem 7 dias de teste grátis. Cancele quando quiser."}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 shadow-xl shadow-gray-100 dark:shadow-gray-950/50 p-8">
                        {selectedPlan ? (
                            <CheckoutRedirector planId={selectedPlan} />
                        ) : (
                            <PlanSelector onSelect={setSelectedPlan} />
                        )}
                    </div>

                    <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        Pagamento 100% seguro via Mercado Pago · Certificado PCI Compliance
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>}>
            <CheckoutContent />
        </Suspense>
    )
}
