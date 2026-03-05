"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/app/actions/clients/createClient"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function AddClientDialog({ onClientAdded }: { onClientAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [skinType, setSkinType] = useState("")
  const [observations, setObservations] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !phone) {
      toast.error("Preencha os campos obrigatórios (Nome e Telefone)")
      return
    }

    setLoading(true)
    
    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', phone)
    if (email) formData.append('email', email)
    if (birthDate) formData.append('birth_date', birthDate)
    if (skinType) formData.append('skin_type', skinType)
    if (observations) formData.append('observations', observations)

    const result = await createClient(formData)
    
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Cliente adicionado com sucesso!")
      setOpen(false)
      resetForm()
      onClientAdded()
    }
  }

  const resetForm = () => {
    setName("")
    setPhone("")
    setEmail("")
    setBirthDate("")
    setSkinType("")
    setObservations("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome Completo *</label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ex: Maria da Silva" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone (WhatsApp) *</label>
              <Input 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="(11) 99999-9999" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Nascimento</label>
              <Input 
                type="date" 
                value={birthDate} 
                onChange={e => setBirthDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="maria@email.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Pele</label>
              <Select value={skinType} onValueChange={setSkinType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="seca">Seca</SelectItem>
                  <SelectItem value="oleosa">Oleosa</SelectItem>
                  <SelectItem value="mista">Mista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea 
              value={observations} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setObservations(e.target.value)} 
              placeholder="Anotações importantes sobre a cliente..." 
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
