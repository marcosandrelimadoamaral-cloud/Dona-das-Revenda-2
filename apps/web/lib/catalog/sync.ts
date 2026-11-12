// Sincronização do catálogo multimarca com as fontes oficiais das marcas.
// Hoje: Hinode (API pública da loja, plataforma VTEX).
// Para incluir uma marca nova, crie um "fetcher" que devolva CatalogRow[] e registre em SOURCES.

import type { SupabaseClient } from "@supabase/supabase-js"

export type CatalogRow = {
  brand: string
  name: string
  description: string | null
  category: string
  subcategory: string | null
  base_price: number
  suggested_price: number
  images: string[]
  attributes: Record<string, unknown>
  barcode: string | null
  sku_code: string
  is_active: boolean
}

const UA = "Mozilla/5.0 (compatible; DonaDaRevendaCatalog/1.0; +https://donadarevenda.com.br)"

function stripHtml(html: string | null | undefined, max = 1200): string | null {
  if (!html) return null
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h\d|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return text ? text.slice(0, max) : null
}

// ---------------------------------------------------------------- VTEX (Hinode)

async function fetchVtexAll(host: string, pageSize = 50, maxItems = 2500): Promise<any[]> {
  const all: any[] = []
  for (let from = 0; from < maxItems; from += pageSize) {
    const to = from + pageSize - 1
    const res = await fetch(`https://${host}/api/catalog_system/pub/products/search?_from=${from}&_to=${to}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      cache: "no-store",
    })
    if (res.status !== 200 && res.status !== 206) throw new Error(`${host} respondeu ${res.status}`)
    const page = (await res.json()) as any[]
    all.push(...page)
    const total = Number((res.headers.get("resources") || "").split("/")[1])
    if (page.length < pageSize || (total && all.length >= total)) break
  }
  return all
}

async function fetchHinode(): Promise<CatalogRow[]> {
  const products = await fetchVtexAll("www.hinode.com.br")
  const rows: CatalogRow[] = []
  for (const p of products) {
    const item = p.items?.[0]
    if (!item) continue
    const offer = item.sellers?.[0]?.commertialOffer ?? {}
    const price = Number(offer.Price) || Number(offer.ListPrice) || 0
    const [cat, sub] = String(p.categories?.[0] ?? "").split("/").filter(Boolean)
    const images: string[] = (item.images ?? []).map((i: any) => String(i.imageUrl)).filter(Boolean).slice(0, 4)
    rows.push({
      brand: "hinode",
      name: String(p.productName).trim(),
      description: stripHtml(p.description),
      category: cat || "Outros",
      subcategory: sub || null,
      // A Hinode não publica o preço de consultor: o custo fica igual ao preço de venda
      // e a revendedora ajusta quando adicionar ao estoque.
      base_price: price,
      suggested_price: price,
      images,
      attributes: {
        source: "hinode-vtex",
        line: p.brand ?? null,
        reference: p.productReference ?? null,
        url: p.link ?? null,
        list_price: Number(offer.ListPrice) || null,
        available: Number(offer.AvailableQuantity) > 0,
        cost_known: false,
        synced_at: new Date().toISOString(),
      },
      barcode: item.ean || null,
      sku_code: `hinode-${p.productId}`,
      is_active: price > 0,
    })
  }
  return rows
}

export const SOURCES: Record<string, { brand: string; skuPrefix: string; fetch: () => Promise<CatalogRow[]> }> = {
  hinode: { brand: "hinode", skuPrefix: "hinode-", fetch: fetchHinode },
}

// ---------------------------------------------------------------- gravação

export async function syncSource(admin: SupabaseClient, key: keyof typeof SOURCES) {
  const source = SOURCES[key]
  const rows = await source.fetch()
  if (rows.length === 0) throw new Error(`${key}: nenhum produto retornado; sincronização cancelada`)

  // Produtos que já vieram da fonte em sincronizações anteriores.
  const { data: existing, error: readErr } = await admin
    .from("catalog_products")
    .select("id, sku_code")
    .eq("brand", source.brand)
    .like("sku_code", `${source.skuPrefix}%`)
  if (readErr) throw readErr
  const idBySku = new Map((existing ?? []).map((r: any) => [r.sku_code, r.id]))

  const toInsert = rows.filter((r) => !idBySku.has(r.sku_code))
  const toUpdate = rows.filter((r) => idBySku.has(r.sku_code)).map((r) => ({ ...r, id: idBySku.get(r.sku_code) }))

  for (let i = 0; i < toInsert.length; i += 200) {
    const { error } = await admin.from("catalog_products").insert(toInsert.slice(i, i + 200))
    if (error) throw error
  }
  for (let i = 0; i < toUpdate.length; i += 200) {
    const { error } = await admin.from("catalog_products").upsert(toUpdate.slice(i, i + 200), { onConflict: "id" })
    if (error) throw error
  }

  // Produtos que saíram do site da marca deixam de aparecer no catálogo.
  const seen = new Set(rows.map((r) => r.sku_code))
  const gone = (existing ?? []).filter((r: any) => !seen.has(r.sku_code)).map((r: any) => r.id)
  if (gone.length) await admin.from("catalog_products").update({ is_active: false }).in("id", gone)

  // Itens de exemplo antigos da mesma marca (sem fonte oficial) saem do catálogo.
  // Continuam no banco para não quebrar o estoque de quem já os adicionou.
  const { count: hiddenSamples } = await admin
    .from("catalog_products")
    .update({ is_active: false }, { count: "exact" })
    .eq("brand", source.brand)
    .not("sku_code", "like", `${source.skuPrefix}%`)
    .eq("is_active", true)

  return { source: key, total: rows.length, inserted: toInsert.length, updated: toUpdate.length, deactivated: gone.length, hiddenSamples: hiddenSamples ?? 0 }
}
