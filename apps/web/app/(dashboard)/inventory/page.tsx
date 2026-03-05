"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Pencil, Trash2, AlertCircle, PackageOpen, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AddProductDialog } from "@/components/dashboard/AddProductDialog"
import { getUserProducts } from "@/app/actions/inventory/getProducts"
import { deleteProduct } from "@/app/actions/inventory/deleteProduct"
import { updateProduct } from "@/app/actions/inventory/updateProduct"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState("")
  const [editPurchasePrice, setEditPurchasePrice] = useState("")
  const [editSalePrice, setEditSalePrice] = useState("")
  const [editStock, setEditStock] = useState("")
  const [editMinStock, setEditMinStock] = useState("")
  const [editExpiration, setEditExpiration] = useState("")

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getUserProducts()
    if (error) {
      toast.error("Erro ao carregar produtos")
    } else if (data) {
      setProducts(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const openEdit = (product: any) => {
    setEditingProduct(product)
    setEditName(product.custom_name || product.catalog_products?.name || "")
    setEditPurchasePrice(product.purchase_price?.toString() || "")
    setEditSalePrice(product.sale_price?.toString() || "")
    setEditStock(product.current_stock?.toString() || "")
    setEditMinStock(product.min_stock_alert?.toString() || "5")
    setEditExpiration(product.expiration_date ? product.expiration_date.split('T')[0] : "")
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return
    if (!editName || !editSalePrice || !editStock || !editPurchasePrice) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    setSavingEdit(true)
    const formData = new FormData()
    formData.append('custom_name', editName)
    formData.append('purchase_price', editPurchasePrice)
    formData.append('sale_price', editSalePrice)
    formData.append('current_stock', editStock)
    formData.append('min_stock_alert', editMinStock || "5")
    if (editExpiration) formData.append('expiration_date', editExpiration)

    const result = await updateProduct(editingProduct.id, formData)
    setSavingEdit(false)

    if (result.error) {
      toast.error(`Erro ao salvar: ${result.error}`)
    } else {
      toast.success("Produto atualizado com sucesso!")
      setEditingProduct(null)
      loadProducts()
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const result = await deleteProduct(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Produto excluído com sucesso")
      loadProducts()
    }
    setDeletingId(null)
  }

  const filteredProducts = products.filter(product => {
    const name = product.custom_name || product.catalog_products?.name || ""
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const editMargin = () => {
    const pp = parseFloat(editPurchasePrice)
    const sp = parseFloat(editSalePrice)
    if (!isNaN(pp) && !isNaN(sp) && pp > 0) {
      const pct = (((sp - pp) / pp) * 100).toFixed(0)
      const val = (sp - pp).toFixed(2).replace('.', ',')
      return `Lucro: R$ ${val} (${pct}%)`
    }
    return null
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">Gerencie seus produtos e preços.</p>
        </div>
        <AddProductDialog onProductAdded={loadProducts} />
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          className="pl-9 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="h-32 bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-white dark:bg-gray-900 border-dashed">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            {searchTerm ? "Tente buscar por outro termo." : "Você ainda não cadastrou nenhum produto no seu estoque."}
          </p>
          {!searchTerm && <AddProductDialog onProductAdded={loadProducts} />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const name = product.custom_name || product.catalog_products?.name
            const brand = product.catalog_products?.brand || "Próprio"
            const stock = product.current_stock
            const minStock = product.min_stock_alert || 5

            let stockColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
            if (stock <= minStock) {
              stockColor = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            } else if (stock <= minStock * 2) {
              stockColor = "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
            }

            return (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="h-32 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                  {product.catalog_products?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.catalog_products.image_url} alt={name} className="h-full object-contain" />
                  ) : (
                    <PackageOpen className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  )}
                  <Badge className="absolute top-2 right-2 shadow-sm" variant="secondary">
                    {brand}
                  </Badge>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium line-clamp-2 min-h-[40px] mb-2">{name}</h3>

                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Estoque</span>
                      <Badge className={`mt-1 font-semibold w-fit ${stockColor}`} variant="outline">
                        {stock} un
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Preço</span>
                      <span className="font-bold text-lg">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sale_price)}
                      </span>
                    </div>
                  </div>

                  {product.expiration_date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <AlertCircle className="w-3 h-3" />
                      Validade: {new Date(product.expiration_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O produto &quot;{name}&quot; será removido do seu estoque.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? "Excluindo..." : "Sim, excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => { if (!open) setEditingProduct(null) }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nome do Produto *</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nome do produto" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Custo (R$) *</label>
                <Input type="number" step="0.01" value={editPurchasePrice} onChange={e => setEditPurchasePrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Preço de Venda (R$) *</label>
                <Input type="number" step="0.01" value={editSalePrice} onChange={e => setEditSalePrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>

            {editMargin() && (
              <div className="text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-md">
                {editMargin()}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Estoque Atual *</label>
                <Input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Alerta Mínimo</label>
                <Input type="number" value={editMinStock} onChange={e => setEditMinStock(e.target.value)} placeholder="5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de Validade</label>
              <Input type="date" value={editExpiration} onChange={e => setEditExpiration(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={savingEdit} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Save className="w-4 h-4 mr-1" />
                {savingEdit ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
