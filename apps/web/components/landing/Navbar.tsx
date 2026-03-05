"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, LayoutDashboard, LogOut, Settings, ChevronDown, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20) }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase
          .from('profiles')
          .select('full_name, plan_type')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/login')
    router.refresh()
  }

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "DR"
  const displayName = profile?.full_name || user?.email?.split('@')[0] || "Revendedora"

  const AuthSection = ({ mobile = false }: { mobile?: boolean }) => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity ${mobile ? 'w-full justify-start p-2' : ''}`}>
              <Avatar className="w-8 h-8 ring-2 ring-purple-500/30">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold leading-none">{displayName}</span>
                <span className="text-xs text-muted-foreground capitalize">{profile?.plan_type === 'pro' ? 'Pro' : 'Trial'}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg mt-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Ir para Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    if (mobile) {
      return (
        <>
          <Link href="/login" className="text-lg font-medium">Entrar</Link>
          <Link href="/signup">
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-4">
              Começar Grátis
            </Button>
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Entrar</Link>
        <Link href="/signup">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
            Começar Grátis
          </Button>
        </Link>
      </>
    )
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.png" alt="Dona da Revenda" width={56} height={56} className="rounded-xl shadow-sm" />
          <div className="flex flex-col leading-none">
            <span className="font-black text-base tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dona da</span>
            <span className="font-black text-base tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent -mt-0.5">Revenda</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</Link>
          <Link href="#agentes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Agentes IA</Link>
          <Link href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Preços</Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <AuthSection />
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8">
                <Link href="#funcionalidades" className="text-lg font-medium">Funcionalidades</Link>
                <Link href="#agentes" className="text-lg font-medium">Agentes IA</Link>
                <Link href="#precos" className="text-lg font-medium">Preços</Link>
                <div className="h-px bg-border my-4" />
                <AuthSection mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
