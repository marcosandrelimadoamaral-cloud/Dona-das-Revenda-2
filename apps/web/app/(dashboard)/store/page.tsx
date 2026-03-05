"use client"

import { Store, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StorePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="w-32 h-32 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Store className="w-16 h-16 text-pink-500 z-10" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
                Sua Vitrine Digital <Sparkles className="w-6 h-6 text-yellow-400" />
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                A IA Clara está configurando uma loja online exclusiva com o seu catálogo. Logo suas clientes poderão montar carrinhos e fazer pedidos direto pelo WhatsApp, 100% integrados ao seu estoque.
            </p>

            <div className="inline-flex items-center justify-center px-6 py-3 border-2 border-pink-200 bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:border-pink-900 dark:text-pink-300 rounded-full font-medium text-lg shadow-sm">
                Em Breve na sua Assinatura PRO
            </div>
        </div>
    )
}
