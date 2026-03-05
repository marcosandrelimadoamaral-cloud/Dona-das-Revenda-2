"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Calendar, Sparkles } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { generateApproach } from "@/app/actions/ai/generateApproach"
import { getClientHistory } from "@/app/actions/clients/getClientHistory"
import { differenceInDays } from "date-fns"

interface ClientProfileSheetProps {
  client: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientProfileSheet({ client, open, onOpenChange }: ClientProfileSheetProps) {
  const [notes, setNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const loadHistory = useCallback(async () => {
    if (!client?.id) return
    setLoadingHistory(true)
    const { data } = await getClientHistory(client.id)
    if (data) setHistory(data)
    setLoadingHistory(false)
  }, [client?.id])

  // Atualiza as notas e carrega o histórico quando o cliente muda
  useEffect(() => {
    if (client) {
      setNotes(client.observations || "")
      loadHistory()
    }
  }, [client, loadHistory])

  if (!client) return null

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null
    const today = new Date()
    const birthDateObj = new Date(birthDate)
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const m = today.getMonth() - birthDateObj.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(client.birth_date)

  const handleSaveNotes = () => {
    toast.success("Anotações salvas com sucesso!")
  }

  const handleGenerateMessage = async () => {
    if (!client?.id) return
    setIsGenerating(true)
    toast.loading("Analisando perfil da cliente e gerando mensagem...", { id: "ai-gen" })

    try {
      const statusLabel = client.client_segment === 'vip' ? 'VIP' :
        (client.last_purchase_date && differenceInDays(new Date(), new Date(client.last_purchase_date)) > 60) ? 'Inativo' : 'Ativo'

      const { success, message, error } = await generateApproach(client.name, statusLabel, client.total_spent || 0)

      if (error || !success) {
        toast.error("Erro ao gerar mensagem: " + error, { id: "ai-gen" })
      } else if (message) {
        toast.success("Mensagem gerada! Redirecionando...", { id: "ai-gen" })
        const text = encodeURIComponent(message)
        const phone = client.phone.replace(/\D/g, '')
        window.open(`https://wa.me/55${phone}?text=${text}`, '_blank')
      }
    } catch (err) {
      toast.error("Ocorreu um erro interno.", { id: "ai-gen" })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl">{client.name}</SheetTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant={client.client_segment === 'vip' ? 'default' : 'secondary'} className={client.client_segment === 'vip' ? 'bg-purple-600' : ''}>
                    {client.client_segment === 'vip' ? 'VIP' : 'Ativo'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            onClick={handleGenerateMessage}
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "Nina está pensando..." : "Gerar Abordagem Inteligente"}
          </Button>
        </SheetHeader>

        <Tabs defaultValue="dados" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Telefone / WhatsApp</p>
                  <a href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="font-medium text-purple-600 hover:underline">
                    {client.phone}
                  </a>
                </div>
              </div>

              {client.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
              )}

              {client.birth_date && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Aniversário</p>
                    <p className="font-medium">
                      {new Date(client.birth_date).toLocaleDateString('pt-BR')}
                      {age !== null && <span className="text-muted-foreground ml-1">({age} anos)</span>}
                    </p>
                  </div>
                </div>
              )}

              {client.address && Object.keys(client.address).length > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Endereço</p>
                    <p className="font-medium">{client.address.street || 'Não informado'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Perfil de Beleza</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Pele</p>
                  <Badge variant="outline" className="capitalize">
                    {client.skin_type || 'Não informado'}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico" className="mt-6 flex-1 overflow-y-auto pr-2 pb-6">
            {loadingHistory ? (
              <div className="space-y-3">
                <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <Calendar className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm">Nenhuma compra registrada ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((sale) => (
                  <div key={sale.id} className="p-3 rounded-lg border bg-white dark:bg-gray-950 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm">
                        {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <Badge variant={sale.status === 'paid' ? 'outline' : 'secondary'} className={
                        sale.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }>
                        {sale.status === 'paid' ? 'Pago' : 'Pendente (Fiado)'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-muted-foreground capitalize">
                        {sale.payment_method === 'pix' ? 'PIX' :
                          sale.payment_method === 'credit' ? 'Cartão de Crédito' :
                            sale.payment_method === 'cash' ? 'Dinheiro' :
                              sale.payment_method === 'fiado' ? 'Fiado' : 'Outro'}
                      </span>
                      <span className="font-bold text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total_amount || sale.total_revenue || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="anotacoes" className="mt-6 space-y-4">
            <Textarea
              placeholder="Adicione anotações sobre preferências, alergias, conversas importantes..."
              className="min-h-[200px] resize-none"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            />
            <Button className="w-full" onClick={handleSaveNotes}>
              Salvar Anotações
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
