import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
// @ts-ignore
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../../.env.local') })
dotenv.config({ path: path.join(__dirname, '../../.env') }) // fallback

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Erro: Variáveis do Supabase (URL ou Service Key) não encontradas em .env")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedCatalog() {
    console.log("🚀 Iniciando Seeding do Catálogo no Supabase...")

    const catalogPath = path.join(__dirname, '../lib/data/catalog-full.json')

    if (!fs.existsSync(catalogPath)) {
        console.error(`❌ Erro: Arquivo de catálogo não encontrado em ${catalogPath}`)
        process.exit(1)
    }

    const catalogDataRaw = fs.readFileSync(catalogPath, 'utf8')
    // Remover BOM se existir
    const fileContent = catalogDataRaw.charCodeAt(0) === 0xFEFF ? catalogDataRaw.slice(1) : catalogDataRaw;
    const catalogData = JSON.parse(fileContent.trim())
    const products = catalogData.products || [];

    console.log(`📦 Encontrados ${products.length} produtos para importar...\n`)

    console.log("🧹 Limpando tabela catalog_products...")
    const { error: deleteError } = await supabase
        .from('catalog_products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
        console.error("❌ Erro ao limpar a tabela:", deleteError.message)
        process.exit(1)
    }

    const BATCH_SIZE = 50
    let totalInserted = 0
    let totalErrors = 0

    const totalBatches = Math.ceil(products.length / BATCH_SIZE)

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE)
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;

        console.log(`Inserindo lote ${batchNum} de ${totalBatches}... (${batch.length} itens)`)

        // Mapeamento obrigatório
        const formattedBatch = batch.map((p: any) => ({
            sku_code: p.id,
            brand: p.brand,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            base_price: p.base_price,
            suggested_price: p.suggested_price,
            attributes: p.attributes,
            images: [`https://source.unsplash.com/400x400/?cosmetics,${p.image_keyword || 'beauty'}`]
        }))

        const { error } = await supabase
            .from('catalog_products')
            .insert(formattedBatch)

        if (error) {
            console.error(`❌ Erro ao inserir lote ${batchNum}:`, error.message)
            totalErrors += batch.length
        } else {
            totalInserted += batch.length
        }
    }

    console.log("\n🎉 Seeding finalizado!")
    console.log(`✅ Sucesso: ${totalInserted}`)
    if (totalErrors > 0) {
        console.log(`❌ Erros: ${totalErrors}`)
    }
}

seedCatalog().catch(console.error)
