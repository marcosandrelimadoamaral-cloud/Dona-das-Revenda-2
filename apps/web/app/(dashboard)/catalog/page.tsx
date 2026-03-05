import { getCatalog } from '@/app/actions/catalog/getCatalog'
import { CatalogView } from '@/components/catalog/CatalogView'

export default async function CatalogPage() {
    // Buscar catálogo inicial na renderização do lado do servidor (SSR)
    // Limite inicial maior para performance no cliente (100)
    const initialData = await getCatalog('', [], [], 50, 0)

    return (
        <div className="space-y-6 pb-20 lg:pb-0 h-full">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Catálogo de Produtos</h1>
                <p className="text-muted-foreground">Adicione produtos de mais de 10 grandes marcas diretamente ao seu estoque.</p>
            </div>

            <CatalogView initialProducts={initialData.products || []} initialCount={initialData.totalCount || 0} />
        </div>
    )
}
