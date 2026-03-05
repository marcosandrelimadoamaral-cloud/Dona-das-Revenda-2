"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Loader2, Sparkles } from "lucide-react"
import { createSubscriptionIntent } from "@/app/actions/billing/createSubscriptionIntent"
import { StripePaymentForm } from "./StripePaymentForm"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Initialize Stripe outside component to avoid re-creation on render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const PLAN_LABELS: Record<string, { name: string; price: string; billing: string }> = {
    monthly: { name: "Mensal", price: "97,00", billing: "Cobrado mensalmente" },
    quarterly: { name: "Trimestral", price: "87,00", billing: "Cobrado a cada 3 meses" },
    annual: { name: "Anual (Líder)", price: "77,50", billing: "Cobrado R$ 930/ano" },
}

interface StripePaymentModalProps {
    open: boolean
    planId: "monthly" | "quarterly" | "annual" | null
    onOpenChange: (open: boolean) => void
}

export function StripePaymentModal({ open, planId, onOpenChange }: StripePaymentModalProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const plan = planId ? PLAN_LABELS[planId] : null

    // When modal opens, create the subscription intent to get clientSecret
    const handleOpenChange = async (newOpen: boolean) => {
        onOpenChange(newOpen)

        if (newOpen && planId) {
            setIsLoading(true)
            setClientSecret(null)

            const result = await createSubscriptionIntent(planId)

            if (result.success && result.clientSecret) {
                setClientSecret(result.clientSecret)
            } else {
                toast.error(result.error || "Erro ao iniciar pagamento.")
                onOpenChange(false)
            }

            setIsLoading(false)
        } else {
            setClientSecret(null)
        }
    }

    const handleSuccess = () => {
        onOpenChange(false)
        setClientSecret(null)
        setTimeout(() => {
            router.push("/billing?success=true")
            router.refresh()
        }, 1500)
    }

    const elementsOptions = clientSecret ? {
        clientSecret,
        appearance: {
            theme: "stripe" as const,
            variables: {
                colorPrimary: "#6366f1",
                colorBackground: "#ffffff",
                colorText: "#1f2937",
                colorDanger: "#ef4444",
                fontFamily: "Inter, system-ui, sans-serif",
                spacingUnit: "4px",
                borderRadius: "8px",
            },
        },
    } : undefined

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        {plan ? `Plano ${plan.name}` : "Assinatura"}
                    </DialogTitle>
                    <DialogDescription>
                        {plan?.billing} · Cancele a qualquer momento.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                            <p className="text-sm text-muted-foreground">Preparando o pagamento seguro...</p>
                        </div>
                    )}

                    {!isLoading && clientSecret && elementsOptions && plan && (
                        <Elements stripe={stripePromise} options={elementsOptions}>
                            <StripePaymentForm
                                planName={plan.name}
                                planPrice={plan.price}
                                onSuccess={handleSuccess}
                                onCancel={() => onOpenChange(false)}
                            />
                        </Elements>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
