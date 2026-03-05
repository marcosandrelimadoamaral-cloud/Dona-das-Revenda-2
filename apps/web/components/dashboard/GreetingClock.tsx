"use client"

import { useState, useEffect } from "react"

export function GreetingClock() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)

    useEffect(() => {
        // Set initial time only after mount to avoid hydration mismatch
        setCurrentTime(new Date())

        // Update every 60 seconds
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        // Cleanup interval on unmount
        return () => clearInterval(timer)
    }, [])

    if (!currentTime) {
        // Return a placeholder structure during SSR to avoid layout shift
        return (
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-gray-200 dark:bg-gray-800 rounded w-48 h-9 mb-2 animate-pulse select-none">
                    Carregando...
                </h1>
                <p className="text-transparent bg-gray-200 dark:bg-gray-800 rounded w-64 h-5 animate-pulse select-none">
                    Carregando data
                </p>
            </div>
        )
    }

    const options = { timeZone: 'America/Sao_Paulo' }
    const brazilTime = new Date(currentTime.toLocaleString('en-US', options))
    const hours = brazilTime.getHours()

    let greeting = 'Boa noite'
    if (hours >= 5 && hours < 12) {
        greeting = 'Bom dia'
    } else if (hours >= 12 && hours < 19) {
        greeting = 'Boa tarde'
    }

    const today = brazilTime.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const formattedTime = brazilTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {greeting}! 👋
            </h1>
            <p className="text-muted-foreground capitalize">
                {today}, {formattedTime}
            </p>
        </div>
    )
}
