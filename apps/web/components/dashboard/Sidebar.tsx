"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Users, ShoppingCart, Bot, PieChart, Settings, LogOut, ArrowLeftRight, Store as StoreIcon, Calendar, RefreshCcw, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Início", href: "/dashboard", icon: Home },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Estoque", href: "/estoque", icon: Package },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Vender (PDV)", href: "/pos", icon: ShoppingCart },
  { name: "Trocas e Devoluções", href: "/exchanges", icon: RefreshCcw },
  { name: "Minha Loja", href: "/store", icon: StoreIcon },
  { name: "Central IA", href: "/ai", icon: Bot },
  { name: "Financeiro", href: "/finance", icon: PieChart },
  { name: "Assinatura", href: "/billing", icon: CreditCard },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex flex-col h-full bg-white dark:bg-gray-900 border-r", className)}>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Dona da Revenda</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto border-t">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          Sair
        </button>
      </div>
    </aside>
  )
}
