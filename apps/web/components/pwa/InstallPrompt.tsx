"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
            setIsInstalled(true)
            return
        }

        const dismissed = localStorage.getItem("pwa-install-dismissed")
        if (dismissed) return

        // iOS detection
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent)

        if (isIosDevice) {
            setIsIOS(true)
            setShowPrompt(true)
        }

        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setShowPrompt(true)
        }

        window.addEventListener("beforeinstallprompt", handler)

        window.addEventListener("appinstalled", () => {
            setIsInstalled(true)
            setShowPrompt(false)
        })

        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === "accepted") {
            setIsInstalled(true)
        }
        setShowPrompt(false)
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem("pwa-install-dismissed", "1")
    }

    if (!showPrompt || isInstalled) return null

    return (
        <div className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-2xl shadow-black/20">
                <div className="flex items-start gap-3 w-full">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Download className="w-6 h-6 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">Instalar Dona da Revenda</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {isIOS ? "Acesse mais rápido adicionando à sua Tela de Início." : "Acesso rápido direto na sua tela inicial."}
                        </p>
                    </div>

                    {/* Close Action */}
                    <button
                        onClick={handleDismiss}
                        className="w-7 h-7 flex items-center justify-center shrink-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {isIOS ? (
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-3 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2 border border-indigo-100 dark:border-indigo-900/50">
                        <span className="text-xl">⬇️</span>
                        <p>
                            Toque no ícone de <strong>Compartilhar</strong> na barra de navegação e depois em <strong>Adicionar à Tela de Início</strong>
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={handleInstall}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl transition-all shadow-md mt-1"
                    >
                        Instalar Agora
                    </button>
                )}
            </div>
        </div>
    )
}
