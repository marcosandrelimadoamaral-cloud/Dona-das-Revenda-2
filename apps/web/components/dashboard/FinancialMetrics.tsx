"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, LineChart, ShoppingBag, CreditCard, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FinancialMetricsProps {
    data: {
        revenue: number;
        cost: number;
        profit: number;
        avgTicket: number;
        totalSales: number;
        stockCapital?: number;
    }
}

export function FinancialMetrics({ data }: FinancialMetricsProps) {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    const marginStr = data.revenue > 0
        ? ((data.profit / data.revenue) * 100).toFixed(1) + '%'
        : '0,0%';

    return (
        <TooltipProvider>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Faturamento Total */}
                <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <div className="flex items-center gap-1.5">
                            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Faturamento Total</CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-3.5 h-3.5 text-emerald-400 hover:text-emerald-600 transition" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-emerald-900 border-0 text-white">Faturamento bruto nas vendas que já foram pagas.</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.revenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Nas vendas pagas do período</p>
                    </CardContent>
                </Card>

                {/* Vendas Totais */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <div className="flex items-center gap-1.5">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Totais</CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800 border-0 text-white">Quantidade de pedidos processados com sucesso no mês.</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalSales}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pedidos processados com sucesso</p>
                    </CardContent>
                </Card>

                {/* Ticket Médio */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <div className="flex items-center gap-1.5">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800 border-0 text-white">Valor médio gasto por cliente nas suas vendas.</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.avgTicket)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Valor médio por cliente</p>
                    </CardContent>
                </Card>

                {/* Capital em Estoque */}
                <Card className="shadow-sm border-purple-100 dark:border-purple-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <div className="flex items-center gap-1.5">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Capital em Estoque</CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-3.5 h-3.5 text-purple-400 hover:text-purple-600 transition" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-purple-900 border-0 text-white">Faturamento estimado se todo o estoque fosse vendido hoje.</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.stockCapital || 0)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Faturamento estimado total</p>
                    </CardContent>
                </Card>

                {/* Lucro Líquido */}
                <Card className="shadow-sm border-blue-100 dark:border-blue-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <div className="flex items-center gap-1.5">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Lucro Líquido</CardTitle>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-3.5 h-3.5 text-blue-400 hover:text-blue-600 transition" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-blue-900 border-0 text-white">Receitas menos Custos. O dinheiro que realmente sobra na sua mão.</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                            <LineChart className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.profit)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Margem bruda de <span className="font-bold text-emerald-600 dark:text-emerald-400">{marginStr}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
