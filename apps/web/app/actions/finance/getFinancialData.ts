'use server'

import { createClient } from '@/lib/supabase/server'

type Period = 'this_month' | 'last_3_months' | 'this_year' | 'custom'

export async function getFinancialData(
    period: Period = 'this_month',
    customStart?: string,  // ISO date string e.g. "2025-01-01"
    customEnd?: string     // ISO date string e.g. "2025-03-31"
) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Usuário não autenticado')

        const now = new Date()
        let startDate: Date
        let endDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59) // end of this month

        if (period === 'this_month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        } else if (period === 'last_3_months') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        } else if (period === 'this_year') {
            startDate = new Date(now.getFullYear(), 0, 1)
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
        } else if (period === 'custom' && customStart && customEnd) {
            startDate = new Date(customStart)
            endDate = new Date(customEnd)
            endDate.setHours(23, 59, 59)
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1) // fallback
        }

        // 1. Buscar vendas no período para os KPIs
        const { data: sales, error: salesError } = await supabase
            .from('sales')
            .select('id, total_revenue, total_cost, status, created_at, is_fiado')
            .eq('user_id', user.id)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: true })

        if (salesError) throw salesError

        // 2. Gráfico: diário para "este mês", mensal para os outros períodos
        let chartStartDate: Date = startDate
        let chartEndDate: Date = endDate
        const useDailyChart = period === 'this_month'

        // Buscar vendas para o gráfico
        const { data: graphSales } = await supabase
            .from('sales')
            .select('id, total_revenue, total_cost, status, created_at')
            .eq('user_id', user.id)
            .eq('status', 'paid')
            .gte('created_at', chartStartDate.toISOString())
            .lte('created_at', chartEndDate.toISOString())

        const chartDataMap = new Map<string, { month: string; revenue: number; expenses: number; profit: number; sortKey: string }>()

        if (useDailyChart) {
            // Construir todos os dias do mês atual
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
            for (let d = 1; d <= daysInMonth; d++) {
                const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                const label = `${d}/${String(now.getMonth() + 1).padStart(2, '0')}`
                chartDataMap.set(key, { month: label, revenue: 0, expenses: 0, profit: 0, sortKey: key })
            }

            // Agrupar vendas por dia
            graphSales?.forEach((sale: any) => {
                const saleDate = new Date(sale.created_at)
                const key = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}-${String(saleDate.getDate()).padStart(2, '0')}`
                if (chartDataMap.has(key)) {
                    const entry = chartDataMap.get(key)!
                    entry.revenue += Number(sale.total_revenue)
                    entry.expenses += Number(sale.total_cost)
                    entry.profit = entry.revenue - entry.expenses
                }
            })
        } else {
            // Mensal: construir todos os meses da janela
            const iterDate = new Date(chartStartDate.getFullYear(), chartStartDate.getMonth(), 1)
            const endMonth = new Date(chartEndDate.getFullYear(), chartEndDate.getMonth(), 1)
            while (iterDate <= endMonth) {
                const monthKey = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, '0')}`
                const monthLabel = iterDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
                chartDataMap.set(monthKey, { month: monthLabel, revenue: 0, expenses: 0, profit: 0, sortKey: monthKey })
                iterDate.setMonth(iterDate.getMonth() + 1)
            }

            // Agrupar vendas por mês
            graphSales?.forEach((sale: any) => {
                const saleDate = new Date(sale.created_at)
                const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`
                if (chartDataMap.has(monthKey)) {
                    const entry = chartDataMap.get(monthKey)!
                    entry.revenue += Number(sale.total_revenue)
                    entry.expenses += Number(sale.total_cost)
                    entry.profit = entry.revenue - entry.expenses
                }
            })
        }

        const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => a.sortKey.localeCompare(b.sortKey))

        // 3. Calcular KPIs do período
        let faturamentoTotal = 0
        let custoTotal = 0
        let vendasPagasCount = 0

        sales?.forEach((sale: any) => {
            if (sale.status === 'paid') {
                faturamentoTotal += Number(sale.total_revenue)
                custoTotal += Number(sale.total_cost)
                vendasPagasCount++
            }
        })

        const lucroLiquido = faturamentoTotal - custoTotal
        const ticketMedio = vendasPagasCount > 0 ? faturamentoTotal / vendasPagasCount : 0

        // 4. Fiados pendentes (todos, não filtrados por período)
        const { data: fiados, error: fiadosError } = await supabase
            .from('sales')
            .select('id, total_revenue, created_at, due_date, status, client_id, clients(name, phone)')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .eq('is_fiado', true)
            .order('due_date', { ascending: true })

        if (fiadosError) throw fiadosError

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const pendingPayments = (fiados || []).map((fiado: any) => {
            const dueDate = new Date(fiado.due_date)
            const diffTime = today.getTime() - dueDate.getTime()
            const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            let statusFiado = 'em_dia'
            if (diasAtraso > 0) statusFiado = 'atrasado'
            else if (diasAtraso >= -3) statusFiado = 'vence_breve'
            return {
                id: fiado.id,
                clientName: fiado.clients?.name || 'Cliente Removido',
                clientPhone: fiado.clients?.phone,
                amount: Number(fiado.total_revenue),
                dueDate: fiado.due_date,
                daysLate: diasAtraso > 0 ? diasAtraso : 0,
                status: statusFiado
            }
        })

        // 5. Capital em Estoque
        const { data: stockItems } = await supabase
            .from('user_products')
            .select('current_stock, sale_price')
            .eq('user_id', user.id)

        let capitalEmEstoque = 0
        stockItems?.forEach((item: any) => {
            capitalEmEstoque += (Number(item.current_stock) || 0) * (Number(item.sale_price) || 0)
        })

        return {
            success: true,
            metrics: {
                revenue: faturamentoTotal,
                cost: custoTotal,
                profit: lucroLiquido,
                avgTicket: ticketMedio,
                totalSales: vendasPagasCount,
                stockCapital: capitalEmEstoque
            },
            chartData,
            pendingPayments
        }

    } catch (error: any) {
        console.error('[getFinancialData] Erro:', error)
        return { success: false, error: error.message || 'Falha ao carregar dados.', metrics: null, chartData: [], pendingPayments: [] }
    }
}
