"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createMPPreference } from "@/app/actions/billing/createMPPreference"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, Lock, ArrowLeft, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

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

// MPCheckoutComponent — fetches Preference ID then renders the Payment Brick
function MPCheckoutComponent({ planId }: { planId: keyof typeof PLANS }) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Initialize Mercado Pago securely on the client side only
    useEffect(() => {
        const mpKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "APP_USR-5a4a1dc6-2150-4b54-970b-f3bb37dc209b"
        initMercadoPago(mpKey, { locale: 'pt-BR' })
    }, [])

    useEffect(() => {
        // Fetch the Mercado Pago Preference ID
        createMPPreference(planId).then((res) => {
            if (res?.success && res.preferenceId) {
                setPreferenceId(res.preferenceId)
                setLoading(false)
            } else {
                setError(res?.error || "Erro ao gerar identificador do Mercado Pago.")
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

    if (loading || !preferenceId) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-muted-foreground font-semibold text-lg">Iniciando ambiente seguro...</p>
            <p className="text-muted-foreground text-xs">Criptografia de ponta-a-ponta Mercado Pago</p>
        </div>
    )

    const initialization = {
        amount: parseFloat(PLANS[planId].price.replace(',', '.')),
        preferenceId: preferenceId,
    }

    const customization = {
        paymentMethods: {
            bankTransfer: 'all', // Enables Pix
            ticket: 'all',       // Enables Boleto
            creditCard: 'all',   // Enables Credit Cards
            maxInstallments: planId === 'annual' ? 12 : 1
        },
        visual: {
            // Apply modern UI customizations matching our theme
            style: {
                theme: 'default' as const, // We use default but we can force css vars to match our site
            }
        }
    }

    const onSubmit = async () => {
        // The Payment Brick handles the submission to MP internally when using preferenceId
        // After approval, it follows the `back_urls.success` defined in the Preference creation!
        return new Promise<void>((resolve) => {
            resolve()
        })
    }

    const onError = async (error: any) => {
        console.error("Payment Brick Error:", error)
        toast.error("Ocorreu um erro ao processar o pagamento na tela.")
    }

    const onReady = async () => {
        console.log("Mercado Pago Brick is ready")
    }

    return (
        <div className="w-full animation-fade-in">
            <Payment
                initialization={initialization}
                customization={customization as any}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
            />
        </div>
    )
}

// Plan selector step
function PlanSelector({ onSelect }: { onSelect: (planId: keyof typeof PLANS) => void }) {
    return (
        <div className="space-y-4">
            <p className="text-center text-muted-foreground mb-6">Escolha o plano que melhor se adapta ao seu negócio:</p>
            {(Object.values(PLANS) as (typeof PLANS[keyof typeof PLANS])[]).map(plan => (
                <button
                    key={plan.id}
                    onClick={() => onSelect(plan.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all hover:scale-[1.01] ${plan.popular
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-500"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900 dark:text-white">{plan.name}</span>
                                {plan.popular && <Badge className="bg-indigo-600 text-white text-[10px] border-0">🔥 Mais escolhido</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">{plan.billing}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-extrabold text-xl text-gray-900 dark:text-white">R$ {plan.price}</div>
                            <div className="text-xs text-muted-foreground">/mês</div>
                        </div>
                    </div>
                </button>
            ))}
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
                        <Image src="/logo.png" alt="Dona da Revenda" width={56} height={56} className="rounded-xl" />
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
                            <MPCheckoutComponent planId={selectedPlan} />
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
