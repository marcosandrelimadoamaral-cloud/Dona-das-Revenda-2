"use client"

import { useState, useEffect } from "react"
import { getSalesHistory } from "@/app/actions/sales/getSalesHistory"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Receipt, Search, Filter } from "lucide-react"

export function SalesHistory() {
    const [sales, setSales] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadHistory() {
            setLoading(true)
            const { data } = await getSalesHistory()
            if (data) setSales(data)
            setLoading(false)
        }
        loadHistory()
    }, [])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    }

    if (loading) {
        return (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-6 border-b"><Skeleton className="h-8 w-48" /></div>
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (sales.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] bg-white dark:bg-gray-900 rounded-3xl border border-dashed text-muted-foreground p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma venda registrada</h3>
                <p className="max-w-md">As vendas finalizadas no PDV aparecerão aqui com todos os detalhes e recibos.</p>
            </div>
        )
    }

    return (
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-gray-950">
            <div className="p-6 border-b flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                <div>
                    <h2 className="text-lg font-bold">Histórico Recente</h2>
                    <p className="text-sm text-muted-foreground">Últimas 50 vendas registradas no sistema.</p>
                </div>
            </div>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-transparent">
                                <TableHead className="font-semibold w-[100px]">Data</TableHead>
                                <TableHead className="font-semibold">Cliente</TableHead>
                                <TableHead className="font-semibold">Itens</TableHead>
                                <TableHead className="font-semibold">Pagamento</TableHead>
                                <TableHead className="font-semibold text-right">Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.map((sale) => (
                                <TableRow key={sale.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(sale.created_at || new Date()), "dd MMM", { locale: ptBR })}</span>
                                            <span className="text-xs text-muted-foreground">{format(new Date(sale.created_at || new Date()), "HH:mm")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {sale.clients?.name ? (
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{sale.clients.name}</span>
                                        ) : (
                                            <span className="text-muted-foreground italic text-xs">Não informado</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            {sale.sale_items?.slice(0, 2).map((item: any, i: number) => (
                                                <span key={i} className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {item.quantity}x {item.user_products?.name || 'Produto Excluído'}
                                                </span>
                                            ))}
                                            {sale.sale_items?.length > 2 && (
                                                <span className="text-[10px] font-medium text-purple-600">
                                                    + {sale.sale_items.length - 2} itens
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {sale.is_fiado ? (
                                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">Fiado</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400 capitalize">
                                                {sale.payment_method?.replace('credit_card', 'Cartão') || 'Pago'}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(Number(sale.total_revenue))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
