"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, Tag, Import, FilterX, Sparkles, Package2, Beaker, Flower2, FlameKindling, Wind, Star } from "lucide-react"
import { getCatalog } from "@/app/actions/catalog/getCatalog"
import { toast } from "sonner"
import { AddProductDialog } from "@/components/dashboard/AddProductDialog"

type CatalogProduct = {
    id: string
    v_id: string
    brand: string
    brand_display: string
    line: string
    name: string
    category: string
    subcategory: string
    base_price: number
    suggested_price: number
    attributes: any
    popular: boolean
    image_placeholder: string
}

const BRANDS = [
    'natura', 'avon', 'boticario', 'marykay', 'jequiti',
    'eudora', 'hinode', 'racco', 'yanbal', 'independentes'
]

const BRAND_COLORS: Record<string, { bg: string; icon: string; emoji: string }> = {
    natura: { bg: 'from-emerald-500/20 to-teal-500/10', icon: 'text-emerald-500', emoji: '🌿' },
    avon: { bg: 'from-pink-500/20 to-rose-500/10', icon: 'text-pink-500', emoji: '🌸' },
    boticario: { bg: 'from-blue-500/20 to-indigo-500/10', icon: 'text-blue-500', emoji: '✨' },
    marykay: { bg: 'from-fuchsia-500/20 to-pink-500/10', icon: 'text-fuchsia-500', emoji: '💄' },
    jequiti: { bg: 'from-amber-500/20 to-orange-500/10', icon: 'text-amber-500', emoji: '🍃' },
    eudora: { bg: 'from-purple-500/20 to-violet-500/10', icon: 'text-purple-500', emoji: '🌺' },
    hinode: { bg: 'from-sky-500/20 to-cyan-500/10', icon: 'text-sky-500', emoji: '💠' },
    racco: { bg: 'from-red-500/20 to-orange-500/10', icon: 'text-red-500', emoji: '🔴' },
    yanbal: { bg: 'from-yellow-500/20 to-amber-500/10', icon: 'text-yellow-500', emoji: '⭐' },
    independentes: { bg: 'from-gray-500/20 to-slate-500/10', icon: 'text-gray-500', emoji: '🏷️' },
}

const DEFAULT_BRAND = { bg: 'from-purple-500/20 to-violet-500/10', icon: 'text-purple-500', emoji: '🛍️' }

export function CatalogView({ initialProducts, initialCount }: { initialProducts: any[], initialCount: number }) {
    const [products, setProducts] = useState<CatalogProduct[]>(initialProducts)
    const [total, setTotal] = useState(initialCount)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedProductForAdd, setSelectedProductForAdd] = useState<CatalogProduct | null>(null)

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProducts(search, selectedBrands, selectedCategories)
        }, 500)
        return () => clearTimeout(handler)
    }, [search, selectedBrands, selectedCategories])

    const fetchProducts = async (query: string, brands: string[], categories: string[]) => {
        setLoading(true)
        const res = await getCatalog(query, brands, categories, 100, 0)
        if (res.success) {
            setProducts(res.products)
            setTotal(res.totalCount)
        } else {
            toast.error(res.error)
        }
        setLoading(false)
    }

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        )
    }

    const clearFilters = () => {
        setSearch("")
        setSelectedBrands([])
        setSelectedCategories([])
    }

    const handleAddProduct = (product: CatalogProduct) => {
        setSelectedProductForAdd(product)
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    const getMarginPct = (sp: number, bp: number) => {
        if (!bp || bp <= 0) return 0
        return Math.round(((sp - bp) / bp) * 100)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
            <AddProductDialog
                open={!!selectedProductForAdd}
                onOpenChange={(open) => !open && setSelectedProductForAdd(null)}
                presetProduct={selectedProductForAdd}
                hideTrigger={true}
                onProductAdded={() => setSelectedProductForAdd(null)}
            />

            {/* Sidebar de Filtros */}
            <aside className="w-full lg:w-60 flex-shrink-0 space-y-5 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
                <div>
                    <h3 className="font-semibold mb-3 flex justify-between items-center text-sm">
                        Filtros
                        {(selectedBrands.length > 0 || search) && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                Limpar
                            </Button>
                        )}
                    </h3>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Marcas</h4>
                    <div className="flex flex-wrap gap-2">
                        {BRANDS.map(brand => {
                            const bc = BRAND_COLORS[brand] || DEFAULT_BRAND
                            const isSelected = selectedBrands.includes(brand)
                            return (
                                <button
                                    key={brand}
                                    onClick={() => toggleBrand(brand)}
                                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-all capitalize ${isSelected
                                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800'
                                        }`}
                                >
                                    {bc.emoji} {brand}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* Grid de Produtos */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                        {loading ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Buscando no catálogo...</span>
                        ) : (
                            <span>Exibindo <strong className="text-foreground">{products.length}</strong> de {total} produtos</span>
                        )}
                    </p>
                </div>

                {products.length === 0 && !loading ? (
                    <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center flex flex-col items-center">
                        <FilterX className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-bold mb-1">Nenhum produto encontrado</h3>
                        <p className="text-muted-foreground max-w-sm mt-1 mb-6 text-sm">Tente ajustar seus filtros ou mudar o termo de busca.</p>
                        <Button variant="outline" onClick={clearFilters}>Limpar filtros</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map(product => {
                            const brandKey = product.brand?.toLowerCase().replace(/\s/g, '') || 'independentes'
                            const bc = BRAND_COLORS[brandKey] || DEFAULT_BRAND
                            const margin = getMarginPct(product.suggested_price, product.base_price)
                            const isGoodMargin = margin >= 40

                            return (
                                <div key={product.id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200">
                                    {/* Product image placeholder — branded gradient */}
                                    <div className={`h-36 bg-gradient-to-br ${bc.bg} flex flex-col items-center justify-center relative overflow-hidden`}>
                                        {/* decorative circles */}
                                        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                                        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10" />
                                        {/* brand emoji icon */}
                                        <span className="text-4xl mb-1 drop-shadow z-10">{bc.emoji}</span>
                                        <span className={`text-xs font-bold uppercase tracking-wider z-10 ${bc.icon} dark:opacity-90`}>
                                            {product.attributes?.brand_display || product.brand}
                                        </span>
                                        {product.popular && (
                                            <div className="absolute top-2 right-2 bg-amber-400 text-white rounded-full p-1">
                                                <Star className="w-3 h-3 fill-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3.5 flex-1 flex flex-col">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {product.category}
                                        </p>
                                        <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 text-gray-900 dark:text-gray-100" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground capitalize mb-3">
                                            {product.subcategory?.replace(/-/g, ' ')}
                                        </p>

                                        <div className="mt-auto space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Custo</p>
                                                    <p className="font-medium text-sm text-gray-700 dark:text-gray-300">{formatCurrency(product.base_price)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Sugestão de Venda</p>
                                                    <div className="flex items-center gap-1.5 justify-end">
                                                        <p className="font-bold text-sm text-purple-600 dark:text-purple-400">{formatCurrency(product.suggested_price)}</p>
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isGoodMargin ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'}`}>
                                                            +{margin}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full text-xs font-semibold h-8 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-purple-600 dark:hover:bg-purple-600 dark:hover:text-white transition-colors mt-1 rounded-xl"
                                                onClick={() => handleAddProduct(product)}
                                            >
                                                <Import className="w-3.5 h-3.5 mr-1.5" />
                                                Adicionar ao Estoque
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
