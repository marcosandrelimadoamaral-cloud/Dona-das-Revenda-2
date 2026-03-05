"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Buscar produtos, clientes..." 
          className="pl-9 bg-gray-50 dark:bg-gray-800 border-none rounded-full h-10"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium leading-none">Ana Silva</span>
            <span className="text-xs text-muted-foreground mt-1">Plano Profissional</span>
          </div>
          <Avatar className="w-9 h-9 border">
            <AvatarImage src="https://i.pravatar.cc/150?u=ana" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
