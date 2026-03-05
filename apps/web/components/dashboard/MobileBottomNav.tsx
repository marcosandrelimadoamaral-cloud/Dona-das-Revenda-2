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
    { href: "/inventory", label: "Estoque", icon: Package },
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
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${isActive
                                ? "text-indigo-600 dark:text-indigo-400"
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
