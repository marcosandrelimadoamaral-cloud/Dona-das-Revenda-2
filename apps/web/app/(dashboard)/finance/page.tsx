"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, MessageCircle, CheckCircle2, Loader2, Filter, AlertCircle, ShoppingBag } from "lucide-react"
import { getFinancialData } from "@/app/actions/finance/getFinancialData"
import Link from "next/link"
import { exportReport } from "@/app/actions/finance/exportReport"
import { updateSaleStatus } from "@/app/actions/sales/updateSaleStatus"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { FinancialMetrics } from "@/components/dashboard/FinancialMetrics"
import { SalesChart } from "@/components/dashboard/SalesChart"

type Period = 'this_month' | 'last_3_months' | 'this_year' | 'custom'

const PERIOD_LABELS: Record<Period, string> = {
  'this_month': 'Este Mês',
  'last_3_months': 'Últimos 3 Meses',
  'this_year': 'Este Ano',
  'custom': 'Personalizado'
}

export default function FinancePage() {
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('this_month')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [metrics, setMetrics] = useState<any>({ revenue: 0, cost: 0, profit: 0, avgTicket: 0, totalSales: 0 })
  const [chartData, setChartData] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])

  // Custom date range
  const todayStr = new Date().toISOString().split('T')[0]
  const firstOfMonthStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const [customStart, setCustomStart] = useState(firstOfMonthStr)
  const [customEnd, setCustomEnd] = useState(todayStr)

  const loadData = useCallback(async (selectedPeriod: Period, start?: string, end?: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await getFinancialData(
        selectedPeriod,
        selectedPeriod === 'custom' ? (start || customStart) : undefined,
        selectedPeriod === 'custom' ? (end || customEnd) : undefined
      )

      if (res.success) {
        setMetrics(res.metrics)
        setChartData(res.chartData)
        setPending(res.pendingPayments)
      } else {
        setErrorMsg(res.error)
        toast.error(res.error)
      }
    } catch (e: any) {
      setErrorMsg("Falha na formatação dos dados.")
    } finally {
      setLoading(false)
    }
  }, [customStart, customEnd])

  useEffect(() => {
    loadData(period)
  }, [period, loadData])

  // When custom dates change, re-load (only when period is custom)
  useEffect(() => {
    if (period === 'custom') loadData('custom', customStart, customEnd)
  }, [customStart, customEnd, period, loadData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const handleCobrar = (cliente: string, amount: number, dueDate: string | null, phone: string | null) => {
    const valorFormatado = formatCurrency(amount)
    const dataVencimento = dueDate
      ? new Date(dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
      : 'em breve'

    const text = `Oi ${cliente}! 😊 Tudo bem?\n\nPassando para te lembrar carinhosamente do seu pedidinho no valor de *${valorFormatado}*, com vencimento em *${dataVencimento}*.\n\nSempre que quiser, pode me chamar! Estou aqui pra te ajudar. 💄✨`

    const phoneClean = phone?.replace(/\D/g, '')
    const url = phoneClean
      ? `https://wa.me/55${phoneClean}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    toast.success(`Mensagem preparada para ${cliente}!`)
  }

  const handleMarcarPago = async (id: string, cliente: string) => {
    setPayingId(id)
    const toastId = toast.loading(`Registrando pagamento de ${cliente}...`)

    const res = await updateSaleStatus(id, 'paid')
    setPayingId(null)

    if (res.success) {
      toast.success("Pagamento registrado! 🎉", { id: toastId })
      loadData(period)
    } else {
      toast.error(res.error || "Erro ao registrar o pagamento", { id: toastId })
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    const toastId = toast.loading('Gerando seu relatório Excel...')

    try {
      const res = await exportReport(period === 'custom' ? 'this_year' : period)

      if (res.success && res.fileBase64) {
        // Converter base64 para Blob para um download mais robusto
        const byteCharacters = atob(res.fileBase64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

        // Criar link de download pelo Blob
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = res.fileName || 'relatorio.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.success("Relatório financeiro baixado em Excel!", { id: toastId })
      } else {
        toast.error(res.error || "Falha ao gerar o relatório.", { id: toastId })
      }
    } catch (e) {
      toast.error("Erro inesperado ao Exportar.", { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }

  if (loading && !metrics.totalSales) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Controle seu fluxo de caixa real e fiados.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap items-center">
          {/* Period selector */}
          <select
            className="flex h-10 w-full sm:w-44 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            disabled={loading}
          >
            <option value="this_month">Este Mês</option>
            <option value="last_3_months">Últimos 3 Meses</option>
            <option value="this_year">Este Ano</option>
            <option value="custom">Personalizado</option>
          </select>

          {/* Custom date range pickers */}
          {period === 'custom' && (
            <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="date"
                value={customStart}
                max={customEnd}
                onChange={e => setCustomStart(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground text-xs">até</span>
              <input
                type="date"
                value={customEnd}
                min={customStart}
                onChange={e => setCustomEnd(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <Button
            variant="default"
            onClick={handleExport}
            disabled={isExporting || loading || !!errorMsg || metrics.totalSales === 0}
            className="gap-2 flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">Exportar</span> Excel
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 p-6 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Erro ao carregar relatório</h3>
            <p className="opacity-90">{errorMsg}</p>
            <Button variant="outline" size="sm" onClick={() => loadData(period)} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        </div>
      )}

      {!loading && !errorMsg && metrics.totalSales === 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-8 rounded-2xl text-center shadow-sm">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nenhuma venda registrada</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">Seus relatórios financeiros aparecerão aqui automaticamente assim que você realizar a primeira venda pelo seu PDV.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Link href="/pos">
              Ir para o PDV
            </Link>
          </Button>
        </div>
      )}

      {(!errorMsg && (loading || metrics.totalSales > 0)) && (
        <FinancialMetrics data={metrics} />
      )}

      {(!errorMsg && (loading || metrics.totalSales > 0)) && (
        <div className="grid grid-cols-12 gap-6">
          <SalesChart data={chartData} />

          <Card className="col-span-12 lg:col-span-4 flex flex-col shadow-sm">
            <CardHeader className="pb-3 border-b dark:border-gray-800">
              <CardTitle className="text-lg">Fiados a Receber</CardTitle>
              <CardDescription className="text-xs">Acompanhe quem está devendo.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium">Nenhum fiado pendente!</p>
                  <p className="text-xs text-muted-foreground mt-1">Todos os clientes estão em dia.</p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-800">
                  {pending.map(sale => {
                    const clientName = sale.clientName

                    return (
                      <div key={sale.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm truncate max-w-[150px]">{clientName}</span>
                            <span className="font-bold text-sm">{formatCurrency(sale.amount)}</span>
                          </div>

                          <Badge variant={sale.status === 'atrasado' ? 'destructive' : sale.status === 'vence_breve' ? 'default' : 'secondary'} className={`text-[10px] ${sale.status === 'vence_breve' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200' : ''}`}>
                            {sale.status === 'atrasado' ? `Atraso: ${sale.daysLate}d` :
                              sale.status === 'vence_breve' ? `Vence logo` :
                                `No prazo`}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            onClick={() => handleCobrar(clientName, sale.amount, sale.dueDate, sale.clientPhone)}>
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Cobrar
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1 h-8 text-xs bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                            disabled={payingId === sale.id}
                            onClick={() => handleMarcarPago(sale.id, clientName)}>
                            {payingId === sale.id
                              ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Salvando...</>
                              : <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Pago</>
                            }
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
