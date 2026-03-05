"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from "next-themes"

interface ChartDataPoint {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
}

interface SalesChartProps {
    data: ChartDataPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const hasData = data && data.some(d => d.revenue > 0 || d.expenses > 0);

    const gridColor = isDark ? '#374151' : '#e5e7eb'
    const tickColor = isDark ? '#9ca3af' : '#6b7280'
    const tooltipBg = isDark ? '#1f2937' : '#ffffff'
    const tooltipBorder = isDark ? '#374151' : '#e5e7eb'
    const tooltipLabel = isDark ? '#f9fafb' : '#111827'

    // Format value for Y axis — exact values, e.g. R$1.200
    const yTickFormatter = (value: number) => {
        if (value === 0) return 'R$0'
        return `R$${value.toLocaleString('pt-BR')}`
    }

    return (
        <Card className="col-span-12 lg:col-span-8 shadow-sm">
            <CardHeader>
                <CardTitle>Receitas vs Custos</CardTitle>
                <CardDescription>Acompanhamento mensal da sua revenda</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                {!hasData ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl">
                            📉
                        </div>
                        <div className="text-center">
                            <p className="font-medium">Nenhuma venda registrada ainda</p>
                            <p className="text-sm">Faça sua primeira venda no PDV para ver o gráfico de crescimento!</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: tickColor, fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                tickFormatter={yTickFormatter}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: tickColor, fontSize: 11 }}
                                dx={-4}
                                width={52}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => [
                                    `R$ ${value.toFixed(2).replace('.', ',')}`,
                                    name
                                ]}
                                labelStyle={{ color: tooltipLabel, fontWeight: 'bold', marginBottom: '8px' }}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: `1px solid ${tooltipBorder}`,
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
                                    background: tooltipBg,
                                    color: isDark ? '#f9fafb' : '#111827',
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px', paddingBottom: '8px', color: tickColor }}
                            />
                            <Line
                                name="Faturamento"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                dot={{ r: 3.5, strokeWidth: 2 }}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                name="Custos"
                                type="monotone"
                                dataKey="expenses"
                                stroke="#f43f5e"
                                strokeWidth={2.5}
                                dot={{ r: 3.5, strokeWidth: 2 }}
                                activeDot={{ r: 5, stroke: '#f43f5e' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
