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
        // Leva para a tela de checkout (Appmax)
        router.push(`/checkout?plan=${planId}&t=${Date.now()}`)
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
            price: "47,50",
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
            billedAmount: "Cobrado R$ 570 anualmente"
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
                <div className="h-32 rounded-3xl bg-gray-100 dark:bg-muted animate-pulse" />
            )}

            {loadedStatus && isPro && (
                <div className="bg-brand-quartzo-fundo dark:from-brand-tinta/30 dark:to-brand-tinta/20 border border-brand-quartzo-claro dark:border-brand-grena-escuro px-6 py-5 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-quartzo-claro dark:bg-brand-grena-escuro flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-brand-grena dark:text-brand-quartzo" />
                    </div>
                    <div>
                        <div className="font-bold text-brand-grena-escuro dark:text-brand-quartzo">Assinante PRO ativo</div>
                        <p className="text-sm text-brand-grena-hover dark:text-brand-quartzo">Você tem acesso completo a todas as ferramentas da Dona da Revenda.</p>
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
                <Card className="border-brand-quartzo-claro dark:border-brand-grena-escuro bg-brand-quartzo-fundo dark:from-brand-tinta/30 dark:to-brand-tinta/20 rounded-3xl overflow-hidden">
                    <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <div className="flex-1 space-y-3 w-full">
                            <div className="flex items-center gap-2 text-brand-grena-hover dark:text-brand-quartzo font-semibold text-lg">
                                <Sparkles className="w-5 h-5" />
                                <span>{daysLeft > 0 ? `Seu período de teste acaba em ${daysLeft} dia${daysLeft === 1 ? '' : 's'}!` : 'Seu período de teste expirou!'}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-muted-foreground leading-relaxed max-w-xl">
                                Você tem acesso total de cortesia a todas as ferramentas premium da Dona da Revenda.
                                Escolha um plano abaixo para garantir que seu sistema não será bloqueado ao final do teste.
                            </p>
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-muted-foreground">
                                    <span>Dia 1</span>
                                    <span>Dia 7</span>
                                </div>
                                <div className="h-2 w-full bg-brand-quartzo-claro dark:bg-brand-tinta rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-grena transition-all duration-500 ease-in-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 w-full md:w-auto text-center">
                            <p className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-muted-foreground mb-2">Próximo Passo</p>
                            <Button
                                onClick={() => handleCheckout("annual")}
                                disabled={isLoadingPayment !== null}
                                className="w-full md:w-auto bg-brand-grena hover:bg-brand-grena-hover text-white rounded-full px-8 h-12 text-base font-semibold shadow-md"
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

                <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden
                                ${plan.highlighted
                                    ? 'border-brand-quartzo-claro dark:border-brand-grena-escuro bg-white dark:bg-muted ring-2 ring-brand-grena dark:ring-brand-grena scale-105 z-10 shadow-xl'
                                    : 'border-gray-200 dark:border-border bg-white dark:bg-background hover:border-brand-quartzo dark:hover:border-brand-grena-hover'
                                }
                            `}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap">
                                    <span className="bg-brand-grena text-white text-[10px] md:text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-b-xl shadow-md">
                                        Melhor valor: 51% de desconto + 7 dias grátis
                                    </span>
                                </div>
                            )}

                            <div className={`mt-${plan.highlighted ? '4' : '0'} mb-6`}>
                                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                                <p className="inline-block text-xs font-bold tracking-wide text-brand-grena dark:text-brand-quartzo uppercase mb-3 bg-brand-quartzo-fundo dark:bg-brand-tinta/50 px-2 py-1 rounded-md">{plan.period === 'mês' && plan.name === 'Anual' ? 'Anual' : plan.name === 'Trimestral' ? 'Trimestral' : 'Mensal'}</p>

                                <div className="mt-2">
                                    {plan.highlighted && (
                                        <p className="text-sm font-bold text-red-500 line-through decoration-red-500/50 mb-1">De R$ 97,00/mês</p>
                                    )}
                                    <div className={`flex items-baseline gap-1 ${plan.highlighted ? 'text-brand-grena dark:text-brand-quartzo' : ''}`}>
                                        <span className="text-4xl md:text-5xl font-extrabold">R$ {plan.price}</span>
                                        <span className="text-muted-foreground font-medium">/mês</span>
                                    </div>
                                    <div className={`text-sm font-bold mt-2 leading-tight ${plan.highlighted ? 'text-emerald-600' : 'text-gray-500 dark:text-muted-foreground'}`}>
                                        {plan.billedAmount || plan.description}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 px-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-brand-grena dark:text-brand-quartzo' : 'text-emerald-500'}`} />
                                        <span className={`text-sm font-medium ${plan.highlighted ? 'text-gray-900 dark:text-foreground' : 'text-gray-600 dark:text-muted-foreground'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <Button
                                    onClick={() => handleCheckout(plan.id)}
                                    disabled={isLoadingPayment !== null}
                                    className={`w-full rounded-xl h-14 font-extrabold text-base md:text-lg transition-all ${plan.highlighted
                                        ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-[0_4px_14px_rgb(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgb(239,68,68,0.4)] animate-pulse hover:animate-none"
                                        : "bg-gray-100 dark:bg-muted hover:bg-gray-200 dark:hover:bg-muted text-gray-900 dark:text-foreground"
                                        }`}
                                >
                                    {isLoadingPayment === plan.id ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Aguarde...</>
                                    ) : (
                                        plan.highlighted ? 'Garantir 51% de Desconto' : `Assinar ${plan.name}`
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pt-8 border-t dark:border-border">
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Pagamento seguro pela Appmax · Pix ou cartão · Cancele quando quiser</span>
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
