import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { SOURCES, syncSource } from "@/lib/catalog/sync"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 60

// Chamado todo dia pela Vercel (vercel.json > crons). A Vercel envia
// "Authorization: Bearer <CRON_SECRET>" quando a variável CRON_SECRET existe no projeto.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const results = []
  for (const key of Object.keys(SOURCES)) {
    try {
      results.push(await syncSource(supabaseAdmin, key))
    } catch (err: any) {
      console.error(`[sync-catalog] ${key}:`, err?.message)
      results.push({ source: key, error: err?.message ?? "erro" })
    }
  }
  console.log("[sync-catalog]", JSON.stringify(results))
  return NextResponse.json({ ok: true, results })
}
