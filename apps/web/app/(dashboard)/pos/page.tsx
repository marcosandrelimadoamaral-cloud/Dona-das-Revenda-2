"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Banknote,
  CreditCard,
  QrCode,
  Clock,
  User,
  PackageOpen,
  CheckCircle2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getUserProducts } from "@/app/actions/inventory/getProducts"
import { getClients } from "@/app/actions/clients/getClients"
import { createSale } from "@/app/actions/sales/createSale"
import { SalesHistory } from "@/components/dashboard/SalesHistory"

type Product = {
  id: string
  name: string
  price: number
  stock: number
  image_url: string | null
}

type CartItem = {
  product_id: string
  name: string
  price: number
  qty: number
  stock_limit: number
  image_url: string | null
}

export default function PosPage() {
  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("none")
  const [discountValue, setDiscountValue] = useState<string>("")
  const [discountType, setDiscountType] = useState<"money" | "percentage">("money")

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "pix" | "credit_card" | "fiado">("cash")
  const [installments, setInstallments] = useState<string>("1")
  const [dueDate, setDueDate] = useState<string>("")

  // UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("catalog") // For mobile view
  const [clientSearch, setClientSearch] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    const [productsRes, clientsRes] = await Promise.all([
      getUserProducts(),
      getClients()
    ])

    if (productsRes.data) {
      const availableProducts = productsRes.data
        .filter(p => p.current_stock > 0)
        .map(p => {
          const product = p as any;
          return {
            id: p.id,
            name: p.custom_name || product.catalog_products?.name || "Produto sem nome",
            price: p.sale_price,
            stock: p.current_stock,
            image_url: product.catalog_products?.image_url || null
          }
        })
      setProducts(availableProducts)
    }

    if (clientsRes.data) {
      setClients(clientsRes.data)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id)

      if (existing) {
        if (existing.qty >= product.stock) {
          toast.warning("Estoque máximo atingido para este produto")
          return prev
        }
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }

      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        stock_limit: product.stock,
        image_url: product.image_url
      }]
    })
    toast.success(`${product.name} adicionado`)
  }

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product_id === productId) {
          const newQty = item.qty + delta
          if (newQty > item.stock_limit) {
            toast.warning("Estoque máximo atingido")
            return item
          }
          if (newQty <= 0) return item // handled by remove
          return { ...item, qty: newQty }
        }
        return item
      })
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId))
  }

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const discountAmount = discountType === "money"
    ? (parseFloat(discountValue) || 0)
    : subtotal * ((parseFloat(discountValue) || 0) / 100)

  const total = Math.max(0, subtotal - discountAmount)

  // Checkout
  const handleFinalizeSale = async () => {
    if (cart.length === 0) return

    if (paymentMethod === "fiado" && !dueDate) {
      toast.error("Data de vencimento é obrigatória para vendas fiadas")
      return
    }

    setIsProcessing(true)

    // Calculate discount ratio to apply to each item
    const discountRatio = subtotal > 0 ? (total / subtotal) : 1

    const saleData = {
      client_id: selectedClient === "none" ? null : selectedClient,
      items: cart.map(item => ({
        product_id: item.product_id,
        product_name: item.name,
        qty: item.qty,
        price: item.price * discountRatio // Apply discount proportionally
      })),
      payment_method: paymentMethod === "credit_card" ? `credit_card_${installments}x` : paymentMethod,
      is_fiado: paymentMethod === "fiado",
      due_date: paymentMethod === "fiado" ? dueDate : undefined
    }

    const result = await createSale(saleData)

    setIsProcessing(false)

    if (result.error) {
      toast.error(`Erro ao finalizar venda: ${result.error}`)
    } else {
      setShowSuccessDialog(true)
      loadData() // Refresh stock
    }
  }

  const handleNewSale = () => {
    setCart([])
    setSelectedClient("none")
    setDiscountValue("")
    setPaymentMethod("cash")
    setInstallments("1")
    setDueDate("")
    setShowSuccessDialog(false)
    setActiveTab("catalog")
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] -m-4 lg:-m-8 flex flex-col">
      <Tabs defaultValue="vender" className="flex-1 flex flex-col overflow-hidden pt-4 px-4 lg:pt-8 lg:px-8">
        {/* Top Header with Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 sm:pb-6 shrink-0 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ponto de Venda</h1>
            <p className="text-muted-foreground text-sm">Registre suas vendas e acompanhe o histórico detalhado.</p>
          </div>
          <TabsList className="bg-gray-100/80 dark:bg-gray-800 shrink-0">
            <TabsTrigger value="vender" className="px-6 rounded-full">Vender</TabsTrigger>
            <TabsTrigger value="historico" className="px-6 rounded-full">Histórico de Vendas</TabsTrigger>
          </TabsList>
        </div>

        {/* ======================================= */}
        {/* TAB 1: AREA DE VENDAS (CATALOGO E CARRINHO) */}
        {/* ======================================= */}
        <TabsContent value="vender" className="flex-1 flex flex-col overflow-hidden m-0 data-[state=inactive]:hidden border border-t-0 sm:border-t rounded-b-3xl sm:rounded-3xl shadow-sm mb-4 sm:mb-8">

          {/* Mobile Cart/Catalog Tabs */}
          <div className="lg:hidden flex border-b bg-white dark:bg-gray-800 shrink-0">
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'catalog' ? 'border-purple-600 text-purple-600' : 'border-transparent text-muted-foreground'}`}
              onClick={() => setActiveTab('catalog')}
            >
              Catálogo
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 ${activeTab === 'cart' ? 'border-purple-600 text-purple-600' : 'border-transparent text-muted-foreground'}`}
              onClick={() => setActiveTab('cart')}
            >
              Carrinho
              {cart.length > 0 && (
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* LEFT SIDE: CATALOG */}
            <div className={`w-full lg:w-[65%] flex flex-col bg-gray-50/50 dark:bg-gray-900/50 ${activeTab === 'catalog' ? 'flex' : 'hidden lg:flex'}`}>
              {/* Catalog Header */}
              <div className="p-4 bg-white dark:bg-gray-800 border-b shrink-0">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto ou escanear código..."
                    className="pl-12 h-12 text-lg rounded-xl bg-gray-50 dark:bg-gray-900 border-transparent focus-visible:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Catalog Grid */}
              <ScrollArea className="flex-1 p-4">
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-48 animate-pulse" />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
                    <PackageOpen className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">Nenhum produto encontrado</p>
                    <p className="text-sm">Verifique o termo de busca ou adicione produtos ao estoque.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 pb-20 lg:pb-0">
                    {filteredProducts.map(product => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:border-purple-500 transition-colors overflow-hidden flex flex-col active:scale-95"
                        onClick={() => addToCart(product)}
                      >
                        <div className="h-28 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-2">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image_url} alt={product.name} className="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          ) : (
                            <PackageOpen className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
                        <CardContent className="p-3 flex-1 flex flex-col">
                          <h3 className="text-sm font-medium line-clamp-2 leading-tight mb-2 flex-1">{product.name}</h3>
                          <div className="flex items-end justify-between mt-auto">
                            <span className="text-xs text-muted-foreground">{product.stock} un</span>
                            <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* RIGHT SIDE: CART */}
            <div className={`w-full lg:w-[35%] flex flex-col bg-white dark:bg-gray-800 border-l ${activeTab === 'cart' ? 'flex' : 'hidden lg:flex'}`}>
              {/* Cart Header */}
              <div className="p-4 border-b shrink-0 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Carrinho
                  <span className="bg-gray-100 dark:bg-gray-700 text-sm px-2 py-0.5 rounded-full text-muted-foreground">
                    {cart.length} itens
                  </span>
                </h2>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setCart([])}>
                    Limpar
                  </Button>
                )}
              </div>

              {/* Cart Items */}
              <ScrollArea className="flex-1">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCartIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p>Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.map(item => (
                      <div key={item.product_id} className="flex gap-3 items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg group">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center shrink-0">
                          {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image_url} alt={item.name} className="h-10 object-contain" />
                          ) : (
                            <PackageOpen className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <div className="text-sm font-bold text-purple-600">
                            {formatCurrency(item.price * item.qty)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-md bg-white dark:bg-gray-950">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => item.qty > 1 ? updateQty(item.product_id, -1) : removeFromCart(item.product_id)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                              onClick={() => updateQty(item.product_id, 1)}
                              disabled={item.qty >= item.stock_limit}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Checkout Section */}
              <div className="border-t bg-gray-50 dark:bg-gray-900/30 p-4 shrink-0 space-y-4">

                {/* Client & Discount */}
                <div className="space-y-3">
                  {/* Cliente — full width */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" /> Cliente
                    </label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger className="h-9 text-sm bg-white dark:bg-gray-950">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Search box inside dropdown */}
                        <div className="px-2 py-1.5 sticky top-0 bg-white dark:bg-gray-950 z-10">
                          <input
                            className="w-full h-8 px-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-gray-400"
                            placeholder="Buscar cliente..."
                            value={clientSearch}
                            onChange={e => setClientSearch(e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                        <SelectItem value="none">Não identificado</SelectItem>
                        {clients
                          .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                          .map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Desconto — full width */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Desconto</label>
                    <div className="flex">
                      <button
                        type="button"
                        className={`px-2 text-xs border border-r-0 rounded-l-md transition-colors ${discountType === 'money' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold' : 'bg-white dark:bg-gray-950 text-muted-foreground'}`}
                        onClick={() => setDiscountType('money')}
                      >
                        R$
                      </button>
                      <button
                        type="button"
                        className={`px-2 text-xs border border-r-0 transition-colors ${discountType === 'percentage' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold' : 'bg-white dark:bg-gray-950 text-muted-foreground'}`}
                        onClick={() => setDiscountType('percentage')}
                      >
                        %
                      </button>
                      <Input
                        type="number"
                        className="h-9 text-sm rounded-l-none bg-white dark:bg-gray-950"
                        placeholder="0"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Forma de Pagamento</label>
                  <div className="grid grid-cols-4 gap-2">
                    <PaymentButton
                      icon={Banknote}
                      label="Dinheiro"
                      active={paymentMethod === 'cash'}
                      onClick={() => setPaymentMethod('cash')}
                    />
                    <PaymentButton
                      icon={QrCode}
                      label="PIX"
                      active={paymentMethod === 'pix'}
                      onClick={() => setPaymentMethod('pix')}
                    />
                    <PaymentButton
                      icon={CreditCard}
                      label="Cartão"
                      active={paymentMethod === 'credit_card'}
                      onClick={() => setPaymentMethod('credit_card')}
                    />
                    <PaymentButton
                      icon={Clock}
                      label="Fiado"
                      active={paymentMethod === 'fiado'}
                      onClick={() => setPaymentMethod('fiado')}
                    />
                  </div>
                </div>

                {/* Conditional Payment Fields */}
                {paymentMethod === 'credit_card' && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Parcelas:</label>
                    <Select value={installments} onValueChange={setInstallments}>
                      <SelectTrigger className="h-8 text-sm bg-white dark:bg-gray-950">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 10, 12].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}x {n === 1 ? 'à vista' : 'sem juros'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {paymentMethod === 'fiado' && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Vencimento *:</label>
                    <Input
                      type="date"
                      className="h-8 text-sm bg-white dark:bg-gray-950"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                )}

                {/* Totals */}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={cart.length === 0 || isProcessing}
                  onClick={handleFinalizeSale}
                >
                  {isProcessing ? "Processando..." : "Finalizar Venda"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ======================================= */}
        {/* TAB 2: HISTÓRICO DE VENDAS */}
        {/* ======================================= */}
        <TabsContent value="historico" className="flex-1 overflow-y-auto m-0 data-[state=inactive]:hidden pb-8">
          <SalesHistory />
        </TabsContent>
      </Tabs>


      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Venda Finalizada!</DialogTitle>
            <DialogDescription className="text-center">
              A venda foi registrada com sucesso no sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button onClick={handleNewSale} className="w-full">
              Nova Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PaymentButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all ${active
        ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-500 dark:text-purple-300'
        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
