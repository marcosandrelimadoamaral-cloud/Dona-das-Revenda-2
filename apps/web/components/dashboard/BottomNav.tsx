"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, Users, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Início", href: "/dashboard", icon: Home },
  { name: "Estoque", href: "/dashboard/inventory", icon: Package },
  { name: "Vender", href: "/dashboard/pos", icon: ShoppingCart, isPrimary: true },
  { name: "Clientes", href: "/dashboard/clients", icon: Users },
  { name: "IA", href: "/dashboard/ai", icon: Bot },
]

export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("bg-white dark:bg-gray-900 border-t pb-safe pt-2 px-2 flex justify-around items-center z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
        
        if (item.isPrimary) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center -mt-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none border-4 border-white dark:border-gray-900">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium mt-1 text-indigo-600 dark:text-indigo-400">{item.name}</span>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-colors",
              isActive 
                ? "text-indigo-600 dark:text-indigo-400" 
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "fill-indigo-50 dark:fill-indigo-900/50" : "")} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
