"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LayoutDashboard, LogOut, Settings, ChevronDown, Sun, Moon } from "lucide-react"
import { Logo } from "@/components/brand/Logo"
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

const navLinks = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#agentes", label: "Assistentes de IA" },
  { href: "#precos", label: "Planos" },
  { href: "#faq", label: "Perguntas" },
]

const linkClass =
  "px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-brand-quartzo-fundo dark:hover:bg-muted transition-all duration-150"

const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-brand-grena-hover transition-colors"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase.from("profiles").select("full_name, plan_type").eq("id", session.user.id).single()
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
    router.push("/login")
    router.refresh()
  }

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "DR"
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Revendedora"

  const ThemeToggle = () =>
    mounted ? (
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-md text-muted-foreground hover:bg-brand-quartzo-fundo dark:hover:bg-muted transition-colors"
        aria-label="Alternar tema"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    ) : (
      <span className="w-8 h-8" />
    )

  const UserMenu = ({ mobile = false }: { mobile?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity ${mobile ? "w-full justify-start p-2" : ""}`}
        >
          <Avatar className="w-8 h-8 ring-2 ring-brand-grena/30">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold leading-none">{displayName}</span>
            <span className="text-xs text-muted-foreground capitalize">{profile?.plan_type === "pro" ? "Pro" : "Trial"}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg mt-1">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
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

  return (
    <motion.header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 safe-area-inset-top",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(42,18,24,0.08)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
          : "bg-transparent",
      ].join(" ")}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Link href="/" className="flex items-center" aria-label="Dona da Revenda">
              <Logo className="h-11 w-auto" priority />
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="hidden md:flex items-center gap-2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entrar
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/signup" className={primaryBtn}>
                    Começar grátis
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:bg-brand-quartzo-fundo dark:hover:bg-muted transition-colors"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-background border-t border-b border-border shadow-lg pb-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-brand-quartzo-fundo dark:hover:bg-muted transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border space-y-2">
              {user ? (
                <UserMenu mobile />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-brand-quartzo-fundo dark:hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Começar grátis
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
