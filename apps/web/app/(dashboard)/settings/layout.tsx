"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const tabs = [
        { name: "Geral", href: "/settings" },
        { name: "Inteligência Artificial", href: "/settings/ai" },
    ]

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20 lg:pb-0">
            <div className="flex items-center gap-4 border-b pb-4">
                <nav className="flex space-x-6">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "text-sm font-medium pb-4 border-b-2 transition-colors",
                                    isActive
                                        ? "border-purple-600 text-purple-600"
                                        : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                                )}
                            >
                                {tab.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div>
                {children}
            </div>
        </div>
    )
}
