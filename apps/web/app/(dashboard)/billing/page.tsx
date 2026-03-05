"use client"

import { useState, useEffect, Suspense } from "react"
import { Check, Sparkles, AlertTriangle, Zap, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSubscriptionStatus } from "@/app/actions/billing/getSubscriptionStatus"
import { useSearchParams, useRouter } from "next/navigation"

function BillingContent() {
    const searchParams = useSearchParams()
    const isExpired = searchParams.get("expired") === "true"

    const totalTrialDays = 7
    const [daysLeft, setDaysLeft] = useState(7)
    const [isPro, setIsPro] = useState(false)
    const [loadedStatus, setLoadedStatus] = useState(false)

    // Progress = how many days have been used (visually shows trial consumption)
    const daysUsed = Math.max(0, totalTrialDays - daysLeft)
    const progress = (daysUsed / totalTrialDays) * 100

    useEffect(() => {
        getSubscriptionStatus().then(({ daysRemaining, isPro: pro }) => {
            setDaysLeft(Math.max(0, daysRemaining))
            setIsPro(pro)
            setLoadedStatus(true)
        })
    }, [])

    const [isLoadingPayment, setIsLoadingPayment] = useState<string | null>(null)
    const isSuccess = searchParams.get("success") === "true"
    const router = useRouter()

    const handleCheckout = (planId: "monthly" | "quarterly" | "annual") => {
        // Route to the embedded Stripe Elements checkout page
        router.push(`/checkout?plan=${planId}`)
    }

    const plans = [
        {
            id: "monthly" as const,
            name: "Mensal",
            price: "97,00",
            period: "mês",
            description: "Perfeito para começar a organizar suas vendas e cobranças.",
            features: [
                "Gestão de Fiados ilimitada",
                "Catálogo Digital (vitrine)",
                "IA Assistente (básico)",
                "Suporte por email"
            ],
            highlighted: false,
        },
        {
            id: "annual" as const,
            name: "Anual",
            price: "77,50",
            period: "mês",
            description: "A melhor escolha para revendedoras estabelecidas. Fature mais gastando menos.",
            features: [
                "Gestão de Fiados ilimitada",
                "Catálogo Digital (vitrine premium)",
                "IA Assistente (ilimitado)",
                "Suporte prioritário via WhatsApp",
                "Relatórios financeiros avançados"
            ],
            highlighted: true,
            badge: "Melhor Custo-Benefício",
            billedAmount: "Cobrado R$ 930,00 anualmente"
        },
        {
            id: "quarterly" as const,
            name: "Trimestral",
            price: "87,00",
            period: "mês",
            description: "Ideal para quem busca um compromisso a médio prazo com desconto inicial.",
            features: [
                "Gestão de Fiados ilimitada",
                "Catálogo Digital (vitrine)",
                "IA Assistente (intermediário)",
                "Suporte por email e chat"
            ],
            highlighted: false,
            billedAmount: "Cobrado R$ 261,00 a cada 3 meses"
        }
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {!loadedStatus && (
                <div className="h-32 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            )}

            {loadedStatus && isPro && (
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/20 border border-purple-200 dark:border-purple-800 px-6 py-5 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <div className="font-bold text-purple-800 dark:text-purple-300">✅ Assinante PRO Ativo</div>
                        <p className="text-sm text-purple-700 dark:text-purple-400">Você tem acesso completo a todas as ferramentas da Dona da Revenda.</p>
                    </div>
                </div>
            )}

            {loadedStatus && isExpired && !isPro && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-semibold">Seu período de teste expirou</h4>
                        <p className="text-sm mt-1 opacity-80">Por favor, escolha um plano de assinatura para recuperar o acesso às ferramentas do seu negócio.</p>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Minha Assinatura</h1>
                <p className="text-muted-foreground">Gerencie seu plano, faturas e métodos de pagamento.</p>
            </div>

            {loadedStatus && !isPro && (
                <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/20 rounded-3xl overflow-hidden">
                    <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <div className="flex-1 space-y-3 w-full">
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-semibold text-lg">
                                <Sparkles className="w-5 h-5" />
                                <span>{daysLeft > 0 ? `Seu período de teste acaba em ${daysLeft} dia${daysLeft === 1 ? '' : 's'}!` : 'Seu período de teste expirou!'}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                                Você tem acesso total de cortesia a todas as ferramentas premium da Dona da Revenda.
                                Escolha um plano abaixo para garantir que seu sistema não será bloqueado ao final do teste.
                            </p>
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-xs font-medium text-gray-500">
                                    <span>Dia 1</span>
                                    <span>Dia 7</span>
                                </div>
                                <div className="h-2 w-full bg-purple-200 dark:bg-purple-950 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500 ease-in-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 w-full md:w-auto text-center">
                            <p className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-2">Próximo Passo</p>
                            <Button
                                onClick={() => handleCheckout("annual")}
                                disabled={isLoadingPayment !== null}
                                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 text-base font-semibold shadow-md"
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Ativar minha conta agora
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pricing Grid */}
            <div className="pt-6">
                <div className="text-center mb-10 space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">Planos simples e transparentes</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Invista na profissionalização do seu negócio de revenda. Assine e mantenha o controle financeiro total nas suas mãos.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-200 shadow-sm
                                ${plan.highlighted
                                    ? 'border-purple-500 dark:border-purple-400 bg-white dark:bg-gray-900 ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-950 md:scale-105 z-10'
                                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-purple-300 dark:hover:border-purple-700'
                                }
                            `}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold">R$ {plan.price}</span>
                                    <span className="text-sm font-medium text-muted-foreground">/{plan.period}</span>
                                </div>
                                {plan.billedAmount && (
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
                                        {plan.billedAmount}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground mt-4 min-h-[40px]">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-3 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${plan.highlighted ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <Button
                                    onClick={() => handleCheckout(plan.id)}
                                    disabled={isLoadingPayment !== null}
                                    className={`w-full rounded-xl h-12 font-semibold text-base transition-all ${plan.highlighted
                                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30'
                                        : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'}`}
                                >
                                    {isLoadingPayment === plan.id ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Aguarde...</>
                                    ) : (
                                        <><Zap className="w-4 h-4 mr-2" /> Assinar Agora</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pt-8 border-t dark:border-gray-800">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>Pagamento seguro via Stripe. Cancele quando quiser.</span>
                </div>
            </div>

        </div>
    )
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Carregando planos de assinatura...</div>}>
            <BillingContent />
        </Suspense>
    )
}
