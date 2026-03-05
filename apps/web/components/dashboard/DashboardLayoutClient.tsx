"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Sparkles,
    Wallet,
    Library,
    Settings,
    Menu,
    Bell,
    Calendar,
    RefreshCcw,
    CreditCard,
    LogOut,
    ChevronUp,
    Sun,
    Moon,
    Crown,
    Clock,
    AlertTriangle,
    X,
    ChevronRight,
    PackageOpen,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
import { logout } from "@/app/actions/auth/logout"
import { getLowStockProducts } from "@/app/actions/inventory/getLowStockProducts"
import { InstallPrompt } from "@/components/pwa/InstallPrompt"
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav"

const navItems = [
    { href: "/dashboard", label: "Início", icon: LayoutDashboard },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/inventory", label: "Estoque", icon: Package },
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/pos", label: "Vender", icon: ShoppingCart },
    { href: "/catalog", label: "Catálogo", icon: Library },
    { href: "/ai", label: "Assistentes IA", icon: Sparkles },
    { href: "/finance", label: "Financeiro", icon: Wallet },
    { href: "/exchanges", label: "Trocas e Devoluções", icon: RefreshCcw },
    { href: "/billing", label: "Assinatura", icon: CreditCard },
    { href: "/settings", label: "Configurações", icon: Settings },
]

export function DashboardLayoutClient({
    children,
    user,
    isPro,
    daysRemaining = 7,
    isTrialValid = true,
}: {
    children: React.ReactNode
    user: any
    isPro: boolean
    daysRemaining?: number
    isTrialValid?: boolean
}) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [showTrialBanner, setShowTrialBanner] = useState(true)
    const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string; type: "trial" | "stock" | "info" }>>([])
    const [notifOpen, setNotifOpen] = useState(false)

    useEffect(() => setMounted(true), [])

    // Build notifications list
    useEffect(() => {
        const items: typeof notifications = []

        if (!isPro && isTrialValid) {
            items.push({
                id: "trial",
                title: `Trial: ${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""} restante${daysRemaining !== 1 ? "s" : ""}`,
                body: "Assine agora para não perder o acesso à plataforma.",
                type: "trial",
            })
        }
        if (!isPro && !isTrialValid) {
            items.push({
                id: "expired",
                title: "Acesso expirado",
                body: "Seu período de teste acabou. Assine para continuar.",
                type: "trial",
            })
        }

        // Load low stock async
        getLowStockProducts().then((res) => {
            if (res.data && res.data.length > 0) {
                items.push({
                    id: "lowstock",
                    title: `${res.data.length} produto${res.data.length > 1 ? "s" : ""} com estoque baixo`,
                    body: res.data.slice(0, 2).map((p: any) => p.custom_name || p.catalog_products?.name || "Produto").join(", ") + (res.data.length > 2 ? ` e mais ${res.data.length - 2}` : ""),
                    type: "stock",
                })
            }
            setNotifications([...items])
        })

        setNotifications(items)
    }, [isPro, isTrialValid, daysRemaining])

    const handleLogout = () => {
        startTransition(() => {
            logout()
        })
    }

    // Trial indicator badge
    const SubscriptionBadge = () => {
        if (isPro) {
            return (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-1">
                    <Crown className="w-3 h-3" />
                    PRO Ativo
                </div>
            )
        }
        if (isTrialValid && daysRemaining > 3) {
            return (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full px-2.5 py-1">
                    <Clock className="w-3 h-3" />
                    Trial: {daysRemaining}d
                </div>
            )
        }
        if (isTrialValid && daysRemaining <= 3) {
            return (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    {daysRemaining}d restantes
                </div>
            )
        }
        return (
            <Link href="/billing">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-full px-2.5 py-1">
                    <AlertTriangle className="w-3 h-3" />
                    Expirado
                </div>
            </Link>
        )
    }

    const NavLinks = () => (
        <>
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium ${isActive
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/60"
                            }`}
                    >
                        <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
                        {item.label}
                    </Link>
                )
            })}
        </>
    )

    const profileInitials = user?.email?.substring(0, 2).toUpperCase() || "DR"
    const displayEmail = user?.email || ""
    const planLabel = isPro ? "Plano PRO ✨" : isTrialValid ? `Trial – ${daysRemaining}d restantes` : "Trial expirado"

    const ProfileFooter = ({ side = "left" }: { side?: "left" | "bottom" }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700/40 rounded-xl p-2 transition-colors group">
                    <Avatar className="w-9 h-9 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                            {profileInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-semibold leading-none truncate">Revendedora</span>
                        <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[130px]">{planLabel}</span>
                    </div>
                    <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side === "bottom" ? "top" : "right"}
                align={side === "bottom" ? "end" : "end"}
                className="w-64 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-1 mb-1"
            >
                <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                                {profileInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <p className="text-sm font-semibold">Revendedora</p>
                            <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
                    <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Configurações da Conta
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
                    <Link href="/billing" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        Assinatura
                        <SubscriptionBadge />
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 rounded-xl"
                    onClick={handleLogout}
                    disabled={isPending}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isPending ? "Saindo..." : "Sair da Conta"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const showStickyBanner = !isPro && daysRemaining <= 3 && showTrialBanner

    return (
        <>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
                {/* Sidebar Desktop */}
                <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                    <div className="h-16 flex items-center px-5 border-b border-gray-100 dark:border-gray-800">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src="/logo.png" alt="Dona da Revenda" width={52} height={52} className="rounded-lg" />
                            <div className="flex flex-col leading-none">
                                <span className="font-black text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dona da</span>
                                <span className="font-black text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent -mt-0.5">Revenda</span>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                        <NavLinks />
                    </nav>

                    {/* Subscription badge in sidebar */}
                    {!isPro && (
                        <div className="px-3 pb-2">
                            <Link href="/billing" className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800 hover:shadow-sm transition-all group">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                        {isTrialValid
                                            ? <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                            : <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                            {isTrialValid ? `${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""} no trial` : "Trial expirado"}
                                        </p>
                                        <p className="text-[10px] text-purple-500 dark:text-purple-500">Toque para assinar</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    )}

                    <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                        <ProfileFooter side="left" />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Trial expiring banner */}
                    {showStickyBanner && (
                        <div className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium ${daysRemaining <= 1
                            ? "bg-red-600 text-white"
                            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                            }`}>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>
                                    {daysRemaining <= 0
                                        ? "Seu trial expirou! Assine para recuperar o acesso."
                                        : `Seu trial expira em ${daysRemaining} dia${daysRemaining !== 1 ? "s" : ""}! Não perca o acesso à plataforma.`}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Link href="/billing" className="bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 text-xs font-bold transition-colors">
                                    Assinar Agora →
                                </Link>
                                <button onClick={() => setShowTrialBanner(false)} className="opacity-70 hover:opacity-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                        {/* Mobile menu */}
                        <div className="flex items-center gap-4 lg:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden">
                                        <Menu className="w-5 h-5" />
                                        <span className="sr-only">Abrir menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-0 flex flex-col bg-white dark:bg-gray-900">
                                    <div className="h-16 flex items-center px-5 border-b dark:border-gray-800">
                                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                                            Dona da Revenda
                                        </span>
                                    </div>
                                    <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                                        <NavLinks />
                                    </nav>
                                    {!isPro && (
                                        <div className="px-3 pb-2">
                                            <Link href="/billing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                                                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                        {isTrialValid ? `${daysRemaining}d no trial` : "Trial expirado"}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-purple-400" />
                                            </Link>
                                        </div>
                                    )}
                                    <div className="p-3 border-t dark:border-gray-800">
                                        <ProfileFooter side="bottom" />
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent lg:hidden">
                                Dona da Revenda
                            </span>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 ml-auto">
                            {/* Dark mode toggle */}
                            {mounted && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="rounded-xl text-muted-foreground hover:text-foreground"
                                    title="Alternar tema"
                                >
                                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </Button>
                            )}

                            {/* Notifications */}
                            <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative rounded-xl text-muted-foreground hover:text-foreground">
                                        <Bell className="w-5 h-5" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2">
                                    <div className="flex items-center justify-between px-2 pb-2 border-b dark:border-gray-700">
                                        <p className="font-semibold text-sm">Notificações</p>
                                        {notifications.length > 0 && (
                                            <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-full px-1.5 py-0.5">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center py-6 text-muted-foreground text-sm">
                                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                                            <p>Nenhuma notificação</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 mt-1">
                                            {notifications.map((n) => (
                                                <div key={n.id} className={`flex gap-3 p-3 rounded-xl ${n.type === "trial"
                                                    ? "bg-purple-50 dark:bg-purple-950/30"
                                                    : n.type === "stock"
                                                        ? "bg-amber-50 dark:bg-amber-950/30"
                                                        : "bg-gray-50 dark:bg-gray-800"
                                                    }`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === "trial" ? "bg-purple-100 dark:bg-purple-900" : "bg-amber-100 dark:bg-amber-900"}`}>
                                                        {n.type === "trial"
                                                            ? <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                            : <PackageOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate">{n.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                                                        {n.type === "trial" && (
                                                            <Link href="/billing" className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline mt-1 block" onClick={() => setNotifOpen(false)}>
                                                                Ver planos →
                                                            </Link>
                                                        )}
                                                        {n.type === "stock" && (
                                                            <Link href="/inventory" className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline mt-1 block" onClick={() => setNotifOpen(false)}>
                                                                Ver estoque →
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Subscription badge in header (desktop only) */}
                            <div className="hidden lg:flex">
                                <SubscriptionBadge />
                            </div>

                            {/* Mobile-only avatar */}
                            <div className="lg:hidden">
                                <ProfileFooter side="bottom" />
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8 bg-gray-50 dark:bg-gray-950">
                        <div className="max-w-7xl mx-auto w-full">{children}</div>
                    </main>
                </div>
            </div>

            {/* PWA Install Prompt */}
            <InstallPrompt />

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </>
    )
}
