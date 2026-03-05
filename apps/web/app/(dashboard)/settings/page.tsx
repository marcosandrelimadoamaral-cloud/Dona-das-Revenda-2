"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getProfile } from "@/app/actions/profile/getProfile"
import { updateProfile } from "@/app/actions/profile/updateProfile"
import { updateBrands } from "@/app/actions/profile/updateBrands"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Save, Upload, Smartphone, Moon, Sun, CreditCard } from "lucide-react"

const AVAILABLE_BRANDS = [
  { id: "natura", label: "Natura" },
  { id: "avon", label: "Avon" },
  { id: "boticario", label: "O Boticário" },
  { id: "marykay", label: "Mary Kay" },
  { id: "eudora", label: "Eudora" },
  { id: "jequiti", label: "Jequiti" },
  { id: "hinode", label: "Hinode" },
  { id: "outras", label: "Outras marcas" },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Profile State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Notifications State
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true)
  const [notifyPush, setNotifyPush] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      const { data } = await getProfile()

      if (data) {
        setFullName(data.full_name || "")
        setPhone(data.phone || "")
        setWhatsapp(data.whatsapp_number || "")
        setEmail((data as any).email || "usuario@email.com") // Placeholder if email not in profile
        setSelectedBrands(data.brands_sold || [])
      }

      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)

    const formData = new FormData()
    formData.append('full_name', fullName)
    formData.append('phone', phone)
    formData.append('whatsapp_number', whatsapp)

    const [profileResult, brandsResult] = await Promise.all([
      updateProfile(formData),
      updateBrands(selectedBrands as any)
    ])

    setSaving(false)

    if (profileResult.error || brandsResult.error) {
      toast.error("Erro ao salvar configurações")
    } else {
      toast.success("Configurações salvas com sucesso!")
      setIsDirty(false)
    }
  }

  const handleBrandToggle = (brandId: string) => {
    setIsDirty(true)
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const handleInputChange = (setter: any) => (e: any) => {
    setIsDirty(true)
    setter(e.target.value)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geral</h1>
          <p className="text-muted-foreground">Gerencie seu perfil e preferências do sistema.</p>
        </div>
        <Button
          onClick={handleSaveProfile}
          disabled={!isDirty || saving}
          className="gap-2"
        >
          {saving ? "Salvando..." : <><Save className="w-4 h-4" /> Salvar Alterações</>}
        </Button>
      </div>

      <Tabs defaultValue="perfil" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 mb-8 bg-gray-100 dark:bg-gray-900 shadow-inner rounded-xl">
          <TabsTrigger value="perfil" className="py-3 px-4 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 hidden sm:block" />
              <span>Meu Perfil</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="loja" className="py-3 px-4 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2">
              <PackageIcon className="w-4 h-4 hidden sm:block" />
              <span>Minha Loja</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="py-3 px-4 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 hidden sm:block" />
              <span>Integrações</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="assinatura" className="py-3 px-4 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 hidden sm:block" />
              <span>Assinatura</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* PERFIL */}
        <TabsContent value="perfil" className="mt-0 outline-none">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-6">
              <CardTitle>Perfil Pessoal</CardTitle>
              <CardDescription>Atualize suas informações de contato e foto.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-24 h-24 border-2">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-purple-50 text-purple-700">
                      {fullName ? fullName.substring(0, 2).toUpperCase() : "DR"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-3 h-3" /> Alterar Foto
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome Completo</label>
                      <Input value={fullName} onChange={handleInputChange(setFullName)} placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email (Login)</label>
                      <Input value={email} disabled className="bg-gray-50 dark:bg-gray-950 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone Principal</label>
                      <Input value={phone} onChange={handleInputChange(setPhone)} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">WhatsApp Profissional</label>
                      <Input value={whatsapp} onChange={handleInputChange(setWhatsapp)} placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MINHA LOJA */}
        <TabsContent value="loja" className="mt-0 outline-none space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-6">
              <CardTitle>Marcas que Revendo</CardTitle>
              <CardDescription>Selecione as marcas que você trabalha para personalizar o catálogo e as sugestões da IA.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AVAILABLE_BRANDS.map(brand => {
                  const isSelected = selectedBrands.includes(brand.id)
                  return (
                    <div
                      key={brand.id}
                      onClick={() => handleBrandToggle(brand.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                        ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-500 transform scale-[1.02]'
                        : 'border-transparent hover:border-gray-200 bg-gray-50 dark:bg-gray-900 dark:hover:border-gray-800'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 dark:border-gray-700'}`}>
                        {isSelected && <CheckIcon className="w-3.5 h-3.5 stroke-[4]" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        {brand.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-6">
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>Ajuste aparência e notificações a seu gosto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aparência</h4>
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Modo Escuro (Dark Mode)</p>
                      <p className="text-xs text-muted-foreground">Alternar tema visual do aplicativo</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notificações</h4>
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div>
                    <p className="font-semibold text-sm">Alertas de Estoque Baixo</p>
                    <p className="text-xs text-muted-foreground">Receber aviso quando produtos atingirem limite</p>
                  </div>
                  <Switch checked={notifyPush} onCheckedChange={(c) => { setIsDirty(true); setNotifyPush(c) }} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div>
                    <p className="font-semibold text-sm">Resumo Financeiro Semanal</p>
                    <p className="text-xs text-muted-foreground">Receber relatório por email toda segunda-feira</p>
                  </div>
                  <Switch checked={notifyEmail} onCheckedChange={(c) => { setIsDirty(true); setNotifyEmail(c) }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTEGRAÇÕES */}
        <TabsContent value="integracoes" className="mt-0 outline-none">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistente via WhatsApp (Zara)</CardTitle>
                    <CardDescription>Auto-atendimento inteligente direto no seu WhatsApp.</CardDescription>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold uppercase tracking-wide px-3 py-1">
                  ✨ Em Breve
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Integração WhatsApp em desenvolvimento</h4>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Em breve você poderá conectar sua conta do WhatsApp e deixar a Zara responder seus clientes automaticamente — cobranças de fiados, consulta de pedidos e muito mais.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <div className="flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Previsão: em breve
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSINATURA */}
        <TabsContent value="assinatura" className="mt-0 outline-none">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-950 dark:to-pink-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                <div className="mb-6 md:mb-0 text-center md:text-left max-w-lg">
                  <div className="flex justify-center md:justify-start">
                    <Badge className="bg-purple-600/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 hover:bg-purple-600/20 mb-3 px-3 py-1 font-bold text-xs rounded-full border border-purple-200 dark:border-purple-800">
                      Status da Conta: ATIVA (Trial)
                    </Badge>
                  </div>
                  <h4 className="text-2xl font-extrabold tracking-tight mb-2">Desbloqueie o Sucesso 🚀</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Você está navegando com acesso temporário ilimitado a todas as integrações, faturamento sem tetos e à Central Inteligente de Agentes IA.
                  </p>
                </div>
                <div className="w-full md:w-auto shrink-0 space-y-3">
                  <Button
                    onClick={() => router.push('/billing')}
                    className="w-full bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5 transition-transform text-white shadow-lg h-12 px-8 rounded-xl font-bold text-base"
                  >
                    Gerenciar Assinatura
                  </Button>
                  <p className="text-xs text-center text-gray-400">Pagamento 100% Seguro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}

function PackageIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
}

function CheckIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
}
