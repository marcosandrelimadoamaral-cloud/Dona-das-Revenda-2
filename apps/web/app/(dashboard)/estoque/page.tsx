import { getInventoryProducts } from "@/app/actions/inventory/getInventoryProducts"
import EstoqueClient from "./EstoqueClient"

// Redireciona import de actions combinadas caso necessario ou importe isolado
import { getBrandsSold as fetchBrands } from "@/app/actions/inventory/createInventoryProduct"

export default async function EstoquePage() {
    const [productsRes, brandsRes] = await Promise.all([
        getInventoryProducts(),
        fetchBrands()
    ])

    const products = productsRes.data || []
    const brands = brandsRes || []

    return <EstoqueClient initialProducts={products} userBrands={brands} />
}
