"use client"

import { useState, useEffect } from "react"
import { Package, ArrowLeftRight, Search, Plus, Store, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getExchanges, ExchangeRecord } from "@/app/actions/exchanges/getExchanges"
import { createExchange } from "@/app/actions/exchanges/createExchange"
import { updateExchangeStatus } from "@/app/actions/exchanges/updateExchangeStatus"
import { toast } from "sonner"

export default function ExchangesPage() {
    const [exchanges, setExchanges] = useState<ExchangeRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchExchanges = async () => {
        setLoading(true)
        const { data, error } = await getExchanges()
        if (error) {
            toast.error("Erro ao carregar trocas: " + error)
        } else if (data) {
            setExchanges(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchExchanges()
    }, [])

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const result = await createExchange(formData)

        if (result.error) {
            toast.error("Erro ao registrar: " + result.error)
        } else {
            toast.success("Troca registrada com sucesso!")
            setIsDialogOpen(false)
            fetchExchanges()
        }
        setIsSubmitting(false)
    }

    const handleResolve = async (id: string) => {
        const result = await updateExchangeStatus(id, "completed")
        if (result.error) {
            toast.error("Erro ao atualizar: " + result.error)
        } else {
            toast.success("Troca resolvida!")
            fetchExchanges()
        }
    }

    const filteredExchanges = exchanges.filter(ex =>
        ex.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pendingCount = exchanges.filter(ex => ex.status === 'pending').length

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ArrowLeftRight className="w-8 h-8 text-orange-500" />
                        Gestão de Trocas
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Registre devoluções, produtos com defeito e gerencie o saldo das suas clientes.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" /> Nova Troca
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Troca ou Devolução</DialogTitle>
                            <DialogDescription>
                                Preencha os dados do produto e o motivo do retorno.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="type">Tipo</Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="defect">Produto com Defeito</option>
                                    <option value="exchange">Troca Simples</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="client_name">Nome da Cliente</Label>
                                <Input id="client_name" name="client_name" placeholder="Ex: Maria" required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="product_name">Produto</Label>
                                <Input id="product_name" name="product_name" placeholder="Ex: Perfume Natura" required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="reason">Motivo</Label>
                                <Input id="reason" name="reason" placeholder="Ex: Válvula quebrada" required />
                            </div>
                            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isSubmitting ? "Registrando..." : "Registrar"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <Card className="border-0 shadow-sm bg-white/70 dark:bg-gray-950/50 backdrop-blur-xl">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <CardTitle>Histórico de Trocas</CardTitle>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar cliente ou produto..."
                                        className="pl-9 bg-white dark:bg-gray-900"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex justify-center p-8 text-muted-foreground">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    </div>
                                ) : exchanges.length === 0 ? (
                                    <div className="flex justify-center p-8 text-muted-foreground">
                                        Nenhuma troca ou devolução registrada.
                                    </div>
                                ) : filteredExchanges.length === 0 ? (
                                    <div className="flex justify-center p-8 text-muted-foreground">
                                        Nenhum resultado encontrado para a busca.
                                    </div>
                                ) : (
                                    filteredExchanges.map((ex) => (
                                        <div key={ex.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border bg-white dark:bg-gray-900/50 hover:shadow-md transition-shadow gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ex.type === 'defect' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {ex.type === 'defect' ? <Package className="w-6 h-6" /> : <ArrowLeftRight className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{ex.product_name}</h4>
                                                    <p className="text-sm text-muted-foreground">Cliente: {ex.client_name} • {ex.reason}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end w-full sm:w-auto justify-between sm:justify-center gap-2">
                                                <Badge variant="secondary" className={ex.status === 'completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                                                    {ex.status === 'completed' ? 'Resolvido' : 'Pendente'}
                                                </Badge>
                                                {ex.status === 'pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                        onClick={() => handleResolve(ex.id)}
                                                    >
                                                        <Check className="w-4 h-4 mr-1" /> Resolver
                                                    </Button>
                                                )}
                                                {ex.status === 'completed' && (
                                                    <span className="text-xs text-muted-foreground">Em {new Date(ex.created_at).toLocaleDateString('pt-BR')}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-orange-50 flex items-center gap-2">
                                <Store className="w-5 h-5" />
                                Resumo do Mês
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-orange-100 text-sm">Trocas Pendentes</p>
                                    <p className="text-3xl font-bold">{pendingCount}</p>
                                </div>
                                <div className="pt-4 border-t border-orange-400/30">
                                    <p className="text-orange-100 text-sm mb-1">Como tratar de defeitos?</p>
                                    <p className="text-sm text-orange-50">Lembre-se de sempre contatar o foco da marca antes de descartar o produto avariado para garantir seu reembolso de custo.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
