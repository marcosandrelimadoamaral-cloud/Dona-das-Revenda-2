"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInventoryProduct } from "@/app/actions/inventory/createInventoryProduct"
import { Plus } from "lucide-react"

interface ProductFormModalProps {
    isOpen: boolean
    setIsOpen: (b: boolean) => void
    userBrands: string[]
    onSuccess: () => void
}

export function ProductFormModal({ isOpen, setIsOpen, userBrands, onSuccess }: ProductFormModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [brand, setBrand] = useState("")
    const [category, setCategory] = useState("Geral")
    const [costPrice, setCostPrice] = useState("")
    const [salePrice, setSalePrice] = useState("")
    const [stock, setStock] = useState("0")
    const [minStock, setMinStock] = useState("5")

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const cost = parseFloat(costPrice.replace(',', '.')) || 0
            const sale = parseFloat(salePrice.replace(',', '.')) || 0

            const res = await createInventoryProduct({
                name,
                brand,
                category,
                costPrice: cost,
                salePrice: sale,
                stockQuantity: parseInt(stock) || 0,
                minStock: parseInt(minStock) || 0
            })

            if (res.success) {
                // Reset form
                setName("")
                setBrand("")
                setCostPrice("")
                setSalePrice("")
                setStock("0")
                setMinStock("5")
                onSuccess()
            } else {
                alert(res.error || "Erro ao salvar")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {!isOpen && (
                <Button onClick={() => setIsOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Novo Produto
                </Button>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Produto</DialogTitle>
                            <DialogDescription>
                                Cadastre um produto para controle financeiro e inteligência de vendas.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Perfume Malbec" className="col-span-3" />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="brand" className="text-right">Marca</Label>
                                <Select value={brand} onValueChange={setBrand}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecione uma marca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userBrands.length > 0 ? (
                                            userBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)
                                        ) : (
                                            <>
                                                <SelectItem value="Natura">Natura</SelectItem>
                                                <SelectItem value="Boticário">Boticário</SelectItem>
                                                <SelectItem value="Avon">Avon</SelectItem>
                                                <SelectItem value="Eudora">Eudora</SelectItem>
                                            </>
                                        )}
                                        <SelectItem value="Outra">Outra / Genérica</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Categoria</Label>
                                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Perfumaria" className="col-span-3" />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cost" className="text-right">Preço de Custo</Label>
                                <Input id="cost" required type="number" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0.00" className="col-span-3" />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sale" className="text-right">Preço de Venda</Label>
                                <Input id="sale" required type="number" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="0.00" className="col-span-3" />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">Estoque Inicial</Label>
                                <Input id="stock" required type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="col-span-3" />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="minstock" className="text-right">Alerta Mínimo</Label>
                                <Input id="minstock" required type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="col-span-3" />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                                {isLoading ? "Salvando..." : "Salvar Produto"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
