"use client"

import { useState } from "react"
import { Clock, ArrowRight, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TrialBanner({ daysRemaining = 7 }: { daysRemaining?: number }) {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible || daysRemaining < 0) return null

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg border border-purple-500/20 mb-6 group">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-8 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 translate-y-8 -translate-x-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl opacity-50"></div>

            <div className="relative px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-white">
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shrink-0">
                        <Clock className="w-6 h-6 text-purple-100" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">
                            {daysRemaining > 1 && `Seu teste grátis expira em ${daysRemaining} dias`}
                            {daysRemaining === 1 && `Seu teste grátis expira AMANHÃ!`}
                            {daysRemaining <= 0 && `Seu teste grátis expira em poucas horas!`}
                        </h3>
                        <p className="text-purple-100 text-sm mt-0.5">
                            Não perca o acesso irrestrito à Clara, Zara e Finn. Assine agora e mantenha seu histórico.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                    <Button
                        asChild
                        variant="secondary"
                        className="w-full sm:w-auto bg-white text-purple-700 hover:bg-gray-50 border-0 shadow-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    >
                        <Link href="/billing">
                            Garantir Acesso PRO
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                        aria-label="Dispensar aviso"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
