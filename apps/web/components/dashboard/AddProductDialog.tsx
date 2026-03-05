"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createProduct } from "@/app/actions/inventory/createProduct"
import { getCatalogProducts } from "@/app/actions/catalog/getCatalogProducts"
import { toast } from "sonner"
import { Plus, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function AddProductDialog({
  onProductAdded,
  presetProduct,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  hideTrigger
}: {
  onProductAdded: () => void,
  presetProduct?: any,
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
  hideTrigger?: boolean
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen

  const [loading, setLoading] = useState(false)
  const [catalogProducts, setCatalogProducts] = useState<any[]>([])
  const [comboboxOpen, setComboboxOpen] = useState(false)

  // Form state
  const [catalogId, setCatalogId] = useState("")
  const [customName, setCustomName] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [salePrice, setSalePrice] = useState("")
  const [currentStock, setCurrentStock] = useState("")
  const [minStockAlert, setMinStockAlert] = useState("5")
  const [expirationDate, setExpirationDate] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    if (open) {
      if (presetProduct) {
        setCatalogId(presetProduct.id)
        setCustomName(presetProduct.name)
        setSalePrice(presetProduct.suggested_price?.toString() || "")
        setPurchasePrice(presetProduct.base_price?.toString() || "")
      } else {
        loadCatalog()
      }
    } else {
      setTimeout(resetForm, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, presetProduct])

  const loadCatalog = async () => {
    const { data } = await getCatalogProducts()
    if (data) setCatalogProducts(data)
  }

  const handleCatalogSelect = (id: string) => {
    setCatalogId(id)
    const product = catalogProducts.find(p => p.id === id) || presetProduct
    if (product) {
      setCustomName(product.name)
      setSalePrice(product.suggested_price?.toString() || "")
      setPurchasePrice(product.base_price?.toString() || "")
    }
    setComboboxOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customName || !salePrice || !currentStock || !purchasePrice) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('custom_name', customName)
    formData.append('purchase_price', purchasePrice)
    formData.append('sale_price', salePrice)
    formData.append('current_stock', currentStock)
    formData.append('min_stock_alert', minStockAlert)
    if (expirationDate) formData.append('expiration_date', expirationDate)
    if (catalogId) formData.append('catalog_id', catalogId)
    if (location) formData.append('location', location)

    const result = await createProduct(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Produto adicionado com sucesso!")
      setOpen(false)
      onProductAdded()
    }
  }

  const resetForm = () => {
    if (!presetProduct) {
      setCatalogId("")
      setCustomName("")
      setPurchasePrice("")
      setSalePrice("")
      setCurrentStock("")
      setMinStockAlert("5")
      setExpirationDate("")
      setLocation("")
    }
  }

  const selectedProduct = catalogProducts.find(p => p.id === catalogId) || presetProduct

  // Calculation logic
  const pPrice = parseFloat(purchasePrice)
  const sPrice = parseFloat(salePrice)
  const calculateMargin = () => {
    if (!isNaN(pPrice) && !isNaN(sPrice) && pPrice > 0) {
      const marginStr = (((sPrice - pPrice) / pPrice) * 100).toFixed(0);
      const valStr = (sPrice - pPrice).toFixed(2).replace('.', ',');
      return `Lucro médio: R$ ${valStr} (${marginStr}%)`;
    }
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Adicionar Produto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="catalog" className="w-full mt-2">
          {!presetProduct && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalog">Do Catálogo</TabsTrigger>
              <TabsTrigger value="custom">Produto Próprio</TabsTrigger>
            </TabsList>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <TabsContent value="catalog" className="space-y-4 mt-0">
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium">Buscar no Catálogo</label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-full justify-between font-normal"
                      disabled={!!presetProduct}
                    >
                      {selectedProduct ? (
                        <span className="truncate">{selectedProduct.name}</span>
                      ) : (
                        <span className="text-muted-foreground">Selecione um produto...</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  {!presetProduct && (
                    <PopoverContent className="w-[450px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar por Nome ou Marca..." />
                        <CommandList>
                          <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                          <CommandGroup>
                            {catalogProducts.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={`${product.name} ${product.brand_display || product.brand}`}
                                onSelect={() => handleCatalogSelect(product.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    catalogId === product.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col flex-1 overflow-hidden">
                                  <span className="truncate font-medium">{product.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                      {product.brand_display || product.brand}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground font-medium">
                                      R$ {product.suggested_price?.toFixed(2).replace('.', ',')}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4 mt-0">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Produto *</label>
                <Input
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="Ex: Perfume Floral 100ml"
                />
              </div>
            </TabsContent>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Custo Unitário (R$) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={e => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço de Venda (R$) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={salePrice}
                  onChange={e => setSalePrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {calculateMargin() && (
              <div className="text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-md flex items-center justify-between">
                {calculateMargin()}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Estoque Inicial *</label>
                <Input
                  type="number"
                  value={currentStock}
                  onChange={e => setCurrentStock(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Alerta de Estoque Mínimo</label>
                <Input
                  type="number"
                  value={minStockAlert}
                  onChange={e => setMinStockAlert(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Validade</label>
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={e => setExpirationDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Localização (Opcional)</label>
                <Input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Ex: Prateleira A"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Produto"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
