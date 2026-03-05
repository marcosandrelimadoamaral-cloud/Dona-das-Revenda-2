"use client"

import { useState } from "react"
import { PackageOpen, Plus, Search, Tag, AlertCircle, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductFormModal } from "@/components/estoque/ProductFormModal"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Product {
    id: string
    name: string
    brand: string
    category: string
    cost_price: number
    sale_price: number
    stock_quantity: number
    min_stock: number
}

interface EstoqueClientProps {
    initialProducts: Product[]
    userBrands: string[]
}

export default function EstoqueClient({ initialProducts, userBrands }: EstoqueClientProps) {
    const [products, setProducts] = useState(initialProducts)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleProductAdded = () => {
        // A página será revalidada pela server action
        // Fechamos o modal apenas
        setIsModalOpen(false)
        toast.success("Produto cadastrado com sucesso!")
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return

        // Optimistic cache
        const original = [...products]
        setProducts(products.filter(p => p.id !== id))

        const supabase = createClient()
        const { error } = await supabase.from('products').delete().eq('id', id)

        if (error) {
            toast.error("Erro ao excluir produto")
            setProducts(original)
        } else {
            toast.success("Produto removido")
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Estoque Base</h1>
                    <p className="text-muted-foreground">Gerencie seus produtos, custos e preços de venda com alertas de quantidade.</p>
                </div>
                <ProductFormModal
                    userBrands={userBrands}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    onSuccess={handleProductAdded}
                />
            </div>

            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar produto por nome ou marca..."
                    className="pl-9 w-full bg-white dark:bg-gray-950"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-2xl bg-white dark:bg-gray-950 border-dashed">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Seu estoque está vazio</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        {searchTerm ? "Nenhum produto bate com sua busca." : "Comece a adicionar produtos para ver a mágica da inteligência artificial acontecer."}
                    </p>
                    {!searchTerm && <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">Adicionar Primeiro Produto</Button>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => {

                        let stockColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                        if (product.stock_quantity <= product.min_stock) {
                            stockColor = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        } else if (product.stock_quantity <= product.min_stock * 2) {
                            stockColor = "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                        }

                        return (
                            <Card key={product.id} className="overflow-hidden flex flex-col group border-gray-100 dark:border-gray-800 hover:border-purple-300 transition-colors">
                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 font-medium">
                                            {product.brand || "Sem marca"}
                                        </Badge>
                                        {product.stock_quantity <= product.min_stock && (
                                            <Tooltip content="Estoque Baixo">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                            </Tooltip>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-lg line-clamp-2 h-14 mb-1">{product.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                        <Tag className="w-3 h-3" /> {product.category || "Geral"}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4 mt-auto bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs">Custo (und)</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">R$ {product.cost_price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs">Venda (und)</span>
                                            <span className="font-bold text-gray-900 dark:text-white">R$ {product.sale_price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground mb-1">Qtd Atual</span>
                                            <Badge className={`font-semibold w-fit shadow-none rounded-md px-2 ${stockColor}`} variant="outline">
                                                {product.stock_quantity} un
                                            </Badge>
                                        </div>

                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function Tooltip({ children, content }: { children: React.ReactNode, content: string }) {
    return (
        <div className="group/tooltip relative flex justify-center cursor-help">
            {children}
            <div className="absolute bottom-full mb-2 hidden group-hover/tooltip:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {content}
            </div>
        </div>
    )
}
