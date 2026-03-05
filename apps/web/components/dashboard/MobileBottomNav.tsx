"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Wallet,
    Users,
    MoreHorizontal,
    Calendar,
    Sparkles,
} from "lucide-react"

const bottomNavItems = [
    { href: "/dashboard", label: "Início", icon: LayoutDashboard },
    { href: "/pos", label: "Vender", icon: ShoppingCart },
    { href: "/ai", label: "IA", icon: Sparkles, primary: true },
    { href: "/finance", label: "Finanças", icon: Wallet },
    { href: "/clients", label: "Clientes", icon: Users },
]

export function MobileBottomNav() {
    const pathname = usePathname()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16 px-1">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

                    if (item.primary) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex-1 flex justify-center h-full"
                            >
                                <div className={`absolute -top-5 flex flex-col items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-gray-900 shadow-lg transition-transform ${isActive ? 'bg-gradient-to-r from-purple-600 to-indigo-600 scale-105' : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105'}`}>
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`absolute bottom-1 text-[10px] font-bold ${isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}>{item.label}</span>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${isActive
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
