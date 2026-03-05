"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, User, Phone, Sparkles, MessageCircle, Copy, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AddClientDialog } from "@/components/dashboard/AddClientDialog"
import { ClientProfileSheet } from "@/components/dashboard/ClientProfileSheet"
import { getClients } from "@/app/actions/clients/getClients"
import { generateApproach } from "@/app/actions/ai/generateApproach"
import { toast } from "sonner"
import { differenceInDays } from "date-fns"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"todos" | "vip" | "inativos" | "ativos">("todos")
  const [selectedClient, setSelectedClient] = useState<any | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // AI Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [generatingAi, setGeneratingAi] = useState(false)
  const [aiMessage, setAiMessage] = useState("")
  const [activeClient, setActiveClient] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  const loadClients = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getClients()
    if (error) {
      toast.error("Erro ao carregar clientes")
    } else if (data) {
      setClients(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleOpenProfile = (client: any) => {
    setSelectedClient(client)
    setIsSheetOpen(true)
  }

  const getClientStatus = (client: any) => {
    const totalSpent = client.total_spent || 0;

    let daysSinceLastPurchase = Infinity;
    if (client.last_purchase_date) {
      daysSinceLastPurchase = differenceInDays(new Date(), new Date(client.last_purchase_date));
    }

    if (totalSpent > 500) {
      return { label: 'VIP', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800' };
    } else if (daysSinceLastPurchase > 60) {
      return { label: 'Inativo', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800' };
    } else {
      return { label: 'Ativo', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' };
    }
  }

  const handleGenerateApproach = async (client: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveClient(client);
    setIsAiModalOpen(true);
    setGeneratingAi(true);
    setAiMessage("");
    setCopied(false);

    const status = getClientStatus(client).label;

    const result = await generateApproach(client.name, status, client.total_spent || 0);

    setGeneratingAi(false);

    if (result.success && result.message) {
      setAiMessage(result.message);
    } else {
      toast.error("Erro ao gerar mensagem");
      setIsAiModalOpen(false);
    }
  }

  const handleSendWhatsApp = () => {
    if (!activeClient || !activeClient.phone) {
      toast.error("Cliente não possui telefone cadastrado");
      return;
    }

    let phone = activeClient.phone.replace(/\D/g, '');
    if (!phone.startsWith('55')) phone = '55' + phone;

    const encodedMessage = encodeURIComponent(aiMessage);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(aiMessage);
    setCopied(true);
    toast.success("Mensagem copiada para a área de transferência");
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (filter === "todos") return true;

    const status = getClientStatus(client).label.toLowerCase();

    if (filter === "vip" && status === "vip") return true;
    if (filter === "inativos" && status === "inativo") return true;
    if (filter === "ativos" && status === "ativo") return true;

    return false;
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM e Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus contatos e engajamento.</p>
        </div>
        <div className="hidden lg:block">
          <AddClientDialog onClientAdded={loadClients} />
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl bg-white/70 dark:bg-gray-950/50 backdrop-blur-xl">
        <CardHeader className="p-6 pb-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Tabela de Clientes</CardTitle>
              <CardDescription>Acesse o histórico e use IA para abordagens.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setFilter("todos")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${filter === "todos" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter("vip")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${filter === "vip" ? "bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  VIPs
                </button>
                <button
                  onClick={() => setFilter("ativos")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${filter === "ativos" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  Ativos
                </button>
                <button
                  onClick={() => setFilter("inativos")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${filter === "inativos" ? "bg-white dark:bg-gray-700 shadow-sm text-red-600 dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  Inativos
                </button>
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  className="pl-9 w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                <TableRow className="border-gray-100 dark:border-gray-800">
                  <TableHead className="w-[300px] pl-6 font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Faturamento</TableHead>
                  <TableHead className="font-semibold">Última Compra</TableHead>
                  <TableHead className="text-right pr-6 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-10 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="pr-6"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <User className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="font-medium text-gray-900 dark:text-gray-100">Nenhum cliente encontrado</p>
                        <p className="text-sm mt-1">{searchTerm ? "Tente usar outro termo de busca." : "Cadastre seu primeiro cliente."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => {
                    const status = getClientStatus(client)

                    return (
                      <TableRow
                        key={client.id}
                        className="cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-900/80 transition-colors border-gray-100 dark:border-gray-800"
                        onClick={() => handleOpenProfile(client)}
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border hidden sm:flex">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-semibold">
                                {getInitials(client.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{client.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                <Phone className="w-3 h-3 mr-1 shrink-0" />
                                {client.phone || 'Sem telefone'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${status.color} uppercase text-[10px] tracking-wider`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.total_spent || 0)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                          {client.last_purchase_date ? new Date(client.last_purchase_date).toLocaleDateString('pt-BR') : 'Nenhuma'}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm h-8 px-2.5 text-xs whitespace-nowrap"
                            onClick={(e) => handleGenerateApproach(client, e)}
                          >
                            <Sparkles className="w-3.5 h-3.5 sm:mr-1.5" />
                            <span className="hidden sm:inline">Gerar Abordagem IA</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE LIST VIEW */}
          <div className="lg:hidden flex flex-col gap-3 p-4 pt-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-2xl bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-2xl border-gray-200 dark:border-gray-800">
                <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="font-semibold text-gray-900 dark:text-white">Nenhum cliente</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ? "Nenhum resultado para a busca." : "Toque no + para adicionar clientes."}
                </p>
              </div>
            ) : (
              filteredClients.map((client) => {
                const status = getClientStatus(client)

                return (
                  <div
                    key={client.id}
                    onClick={() => handleOpenProfile(client)}
                    className="flex flex-col p-4 gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight block">{client.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Phone className="w-3 h-3 mr-1 shrink-0" />
                            {client.phone || 'S/ N'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${status.color} uppercase text-[10px] tracking-wider px-2 py-0 border-0 shadow-sm`}>
                        {status.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-1">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Total Gasto</p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.total_spent || 0)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800 h-9 rounded-xl shadow-none px-3"
                        onClick={(e) => handleGenerateApproach(client, e)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold">Gerar IA</span>
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Floating Action Button - Add Client */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
        <AddClientDialog onClientAdded={loadClients} isFloating={true} />
      </div>

      <ClientProfileSheet
        client={selectedClient}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Abordagem com IA
            </DialogTitle>
            <DialogDescription>
              A Clara gerou uma mensagem personalizada para {activeClient?.name?.split(' ')[0]}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {generatingAi ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground font-medium animate-pulse">Clara está digitando...</p>
              </div>
            ) : (
              <div className="relative group">
                <Textarea
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="min-h-[160px] text-sm resize-none pr-10 border-purple-100 bg-purple-50/30 focus-visible:ring-purple-300 dark:border-purple-900/30 dark:bg-purple-950/20"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAiModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              disabled={generatingAi || !aiMessage}
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
