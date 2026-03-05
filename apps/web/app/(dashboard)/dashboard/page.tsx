import { getFinancialData } from "@/app/actions/finance/getFinancialData"
import { getClients } from "@/app/actions/clients/getClients"
import { Sparkles, Plus, Users, TrendingUp, DollarSign, ArrowDown, Activity, Info, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { WelcomeToast } from "./WelcomeToast"
import { GreetingClock } from "@/components/dashboard/GreetingClock"
import { TrialBanner } from "@/components/dashboard/TrialBanner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarWidget } from "@/components/dashboard/CalendarWidget"
import { NinaStockAlert } from "@/components/dashboard/NinaStockAlert"

import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const isWelcome = searchParams.welcome === 'true'

  // Fetch data
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [financialResponse, clientsResponse, { data: subscription }, { data: profile }] = await Promise.all([
    getFinancialData('this_month'),
    getClients(),
    supabase.from('subscriptions').select('*').eq('user_id', user?.id).single(),
    supabase.from('profiles').select('created_at').eq('id', user?.id).single()
  ])

  const metrics = financialResponse.metrics || { revenue: 0, cost: 0, profit: 0, avgTicket: 0, totalSales: 0, stockCapital: 0 }
  const clients = clientsResponse.data || []
  const margin = metrics.revenue > 0 ? ((metrics.profit / metrics.revenue) * 100).toFixed(1) : 0

  const isPro = subscription?.status === 'active'
  let daysRemaining = 0

  if (subscription && subscription.status === 'trialing') {
    const end = new Date(subscription.current_period_end).getTime()
    const now = new Date().getTime()
    daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  } else if (!isPro && !subscription && profile?.created_at) {
    const createdDate = new Date(profile.created_at).getTime()
    const trialEnd = createdDate + (7 * 24 * 60 * 60 * 1000)
    const now = new Date().getTime()
    daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      {isWelcome && <WelcomeToast />}

      {!isPro && daysRemaining >= 0 && <TrialBanner daysRemaining={daysRemaining} />}

      <div className="flex justify-between items-end">
        <GreetingClock />
        <div className="hidden sm:flex gap-3">
          <Link href="/pos">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Vender
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-col gap-6">
        <TooltipProvider>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 order-2 lg:order-none">

            {/* Card: Vendas */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-950/50 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-sm rounded-3xl p-6 group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-24 h-24 text-purple-600" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 hover:text-purple-600 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-purple-900 border-purple-800 text-white">
                    <p className="flex items-center gap-2">Quantidade de pedidos processados com sucesso neste mês.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Vendas (Mês)</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalSales}</h3>
              <div className="mt-4 h-8 w-full">
                {/* Simple SVG Sparkline placeholder */}
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-purple-500 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0,15 L20,10 L40,12 L60,5 L80,8 L100,2" />
                </svg>
              </div>
            </div>

            {/* Card: Receitas */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-950/50 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-sm rounded-3xl p-6 group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-24 h-24 text-blue-600" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-indigo-900 border-indigo-800 text-white">
                    <p className="flex items-center gap-2">Faturamento bruto das vendas que já foram pagas.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Receita Realizada</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenue)}
              </h3>
              <div className="mt-4 h-8 w-full">
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-blue-500 fill-blue-500/10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0,18 L20,14 L40,15 L60,8 L80,10 L100,2 L100,20 L0,20 Z" />
                  <path d="M0,18 L20,14 L40,15 L60,8 L80,10 L100,2" fill="none" />
                </svg>
              </div>
            </div>

            {/* Card: Despesas / Custos */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-950/50 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-sm rounded-3xl p-6 group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ArrowDown className="w-24 h-24 text-red-600" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <ArrowDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 hover:text-red-600 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-rose-900 border-rose-800 text-white">
                    <p className="flex items-center gap-2">Custo de compra apenas das mercadorias que foram vendidas.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Custos (CMV)</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.cost)}
              </h3>
              <div className="mt-4 h-8 w-full">
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-red-400 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0,10 L25,12 L50,11 L75,14 L100,10" />
                </svg>
              </div>
            </div>

            {/* Card: Capital em Estoque */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-950/50 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-sm rounded-3xl p-6 group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShoppingBag className="w-24 h-24 text-amber-500" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 hover:text-amber-600 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-amber-900 border-amber-800 text-white">
                    <p className="flex items-center gap-2">Faturamento estimado se todo o estoque fosse vendido hoje.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Capital em Estoque</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.stockCapital || 0)}
              </h3>
              <div className="mt-4 h-8 w-full">
                <svg viewBox="0 0 100 20" className="w-full h-full stroke-amber-400 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0,15 L25,12 L50,14 L75,8 L100,5" />
                </svg>
              </div>
            </div>

            {/* Card: Lucro Líquido */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg rounded-3xl p-6 group hover:shadow-xl transition-all text-white">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-24 h-24 text-white" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-emerald-100 hover:text-white transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border-0 text-emerald-900 shadow-xl">
                    <p className="flex items-center gap-2 font-medium">
                      Receitas menos Custos. O dinheiro que realmente sobra na sua mão.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-emerald-50 font-medium mb-1 drop-shadow-sm">Lucro Líquido</p>
              <h3 className="text-3xl font-bold drop-shadow-sm">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.profit)}
              </h3>
              <div className="mt-4 h-8 w-full flex items-end">
                <div className="flex items-center text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  <TrendingUp className="w-4 h-4 mr-1" /> Margem: {margin}%
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
        <div className="grid gap-6 lg:grid-cols-3 mt-2 lg:mt-8 order-1 lg:order-none">
          <div className="lg:col-span-2">
            <CalendarWidget />
          </div>

          <div className="space-y-6">
            <NinaStockAlert />
            {/* Quick Actions or related shortcuts */}
            <div className="bg-white dark:bg-gray-950 border rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Acesso Rápido</h3>
              <div className="space-y-3">
                <Link href="/exchanges" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-100 text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                  Minhas Trocas e Devoluções
                </Link>
                <Link href="/store" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-100 text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-3">
                    <Plus className="w-4 h-4" />
                  </div>
                  Minha Loja Digital
                </Link>
                <Link href="/clients" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-100 text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <Users className="w-4 h-4" />
                  </div>
                  Base de Clientes ({clients.length})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
