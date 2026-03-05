"use client"

import { useState } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck, Lock } from "lucide-react"
import { toast } from "sonner"

interface StripePaymentFormProps {
    onSuccess: () => void
    onCancel: () => void
    planName: string
    planPrice: string
}

export function StripePaymentForm({ onSuccess, onCancel, planName, planPrice }: StripePaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            toast.error("Sistema de pagamento ainda carregando. Tente novamente.")
            return
        }

        setIsProcessing(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/billing?success=true`,
            },
            redirect: "if_required",
        })

        if (error) {
            setIsProcessing(false)
            if (error.type === "card_error" || error.type === "validation_error") {
                toast.error(error.message || "Erro no cartão. Verifique os dados.")
            } else {
                toast.error("Ocorreu um erro inesperado. Tente novamente.")
            }
        } else {
            toast.success("✅ Assinatura ativada com sucesso!")
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Plano {planName}</div>
                    <div className="text-xs text-muted-foreground">Assinatura recorrente · Cancele quando quiser</div>
                </div>
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    R$ {planPrice}<span className="text-xs font-normal text-muted-foreground">/mês</span>
                </div>
            </div>

            {/* Stripe Elements payment form */}
            <div className="rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-4">
                    <PaymentElement
                        options={{
                            layout: "tabs",
                            fields: {
                                billingDetails: {
                                    name: "auto",
                                    email: "never",
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Seguro</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Stripe Encrypted</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="flex-1"
                >
                    Voltar
                </Button>
                <Button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold h-12 text-base"
                >
                    {isProcessing ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...</>
                    ) : (
                        `Assinar por R$ ${planPrice}/mês`
                    )}
                </Button>
            </div>
        </form>
    )
}
