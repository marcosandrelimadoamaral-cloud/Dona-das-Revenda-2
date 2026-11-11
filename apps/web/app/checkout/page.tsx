"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Copy, CreditCard, Loader2, Lock, QrCode, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/brand/Logo"
import { createClient } from "@/lib/supabase/client"

type PlanId = "monthly" | "quarterly" | "annual"
type Method = "pix" | "card"

const PLANS: Record<PlanId, { name: string; price: string; billing: string; badge?: string }> = {
  monthly: { name: "Mensal", price: "97,00", billing: "Cobrado todo mês. Sem fidelidade." },
  quarterly: { name: "Trimestral", price: "87,00", billing: "R$ 261 a cada 3 meses. 10% de desconto." },
  annual: { name: "Anual", price: "47,50", billing: "R$ 570 por ano. Economia de R$ 594.", badge: "Melhor valor" },
}

const maskCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const maskCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim()

const maskExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function pixImageSrc(qr: string) {
  if (!qr) return ""
  return qr.startsWith("data:") || qr.startsWith("http") ? qr : `data:image/png;base64,${qr}`
}

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()
  const isNewUser = params.get("newUser") === "true"
  const initial = params.get("plan") as PlanId | null

  const [plan, setPlan] = useState<PlanId>(initial && PLANS[initial] ? initial : "annual")
  const [method, setMethod] = useState<Method>("pix")
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phone, setPhone] = useState("")
  const [card, setCard] = useState({ number: "", exp: "", cvv: "", holderName: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pix, setPix] = useState<{ qrcode: string; emv: string } | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [waiting, setWaiting] = useState<"pix" | "card" | null>(null)
  const [paid, setPaid] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const nextUrl = useMemo(() => (isNewUser ? "/onboarding" : "/dashboard"), [isNewUser])

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const n = data.user?.user_metadata?.full_name || data.user?.user_metadata?.name
        if (n) setName((cur) => cur || n)
      })
      .catch(() => {})
  }, [])

  // Acompanha a confirmação do pagamento (Pix ou cartão) a cada 4 segundos.
  useEffect(() => {
    if (!orderId || !waiting) return
    const check = async () => {
      try {
        const res = await fetch(`/api/checkout/appmax/status?order=${orderId}`, { cache: "no-store" })
        const json = await res.json()
        if (json.paid) {
          setPaid(true)
          if (timer.current) clearInterval(timer.current)
          setTimeout(() => router.push(nextUrl), 1800)
        }
      } catch {
        /* tenta de novo no próximo ciclo */
      }
    }
    check()
    timer.current = setInterval(check, 4000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [orderId, waiting, router, nextUrl])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const [expMonth, expYear] = card.exp.split("/")
      const res = await fetch("/api/checkout/appmax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          method,
          name,
          cpf,
          phone,
          card:
            method === "card"
              ? { number: card.number, cvv: card.cvv, expMonth, expYear, holderName: card.holderName || name, holderCpf: cpf }
              : undefined,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/checkout?plan=${plan}`)}`)
        return
      }
      if (!res.ok || !json.ok) {
        setError(json.error || "Não foi possível concluir o pagamento.")
        return
      }
      setOrderId(json.orderId)
      if (json.method === "pix") {
        setPix(json.pix)
        setWaiting("pix")
      } else {
        setWaiting("card")
      }
      // Limpa os dados do cartão da memória da tela.
      setCard({ number: "", exp: "", cvv: "", holderName: "" })
    } catch {
      setError("Sem conexão. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const copyPix = async () => {
    if (!pix) return
    try {
      await navigator.clipboard.writeText(pix.emv)
      toast.success("Código Pix copiado")
    } catch {
      toast.error("Não foi possível copiar. Selecione o código e copie manualmente.")
    }
  }

  const current = PLANS[plan]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Dona da Revenda">
            <Logo variant="horizontal" className="h-8 w-auto" />
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-4xl grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
          {/* Resumo e escolha do plano */}
          <section className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">Assinar a Dona da Revenda</h1>
              <p className="mt-2 text-muted-foreground">Escolha o plano e a forma de pagamento. Você pode cancelar quando quiser.</p>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Plano">
              {(Object.keys(PLANS) as PlanId[]).map((id) => {
                const p = PLANS[id]
                const active = id === plan
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={!!waiting}
                    onClick={() => setPlan(id)}
                    className={`relative w-full text-left rounded-2xl border p-4 transition-all disabled:opacity-60 ${
                      active ? "border-primary bg-brand-quartzo-fundo dark:bg-card ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2.5 right-4 rounded-full bg-brand-ouro text-brand-tinta px-2.5 py-0.5 text-[11px] font-semibold">
                        {p.badge}
                      </span>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-bold">{p.name}</span>
                      <span className="text-lg font-bold">
                        R$ {p.price}
                        <span className="text-xs font-medium text-muted-foreground">/mês</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.billing}</p>
                  </button>
                )
              })}
            </div>

            <ul className="text-sm text-muted-foreground space-y-2">
              {["5 assistentes de IA", "PDV, estoque, clientes e fiados", "Catálogo multimarca", "Financeiro e relatórios em Excel"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </section>

          {/* Pagamento */}
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-soft">
            {paid ? (
              <div className="py-10 text-center space-y-3">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold">Pagamento confirmado</h2>
                <p className="text-muted-foreground">Sua assinatura está ativa. Levando você para o sistema...</p>
              </div>
            ) : waiting === "pix" && pix ? (
              <div className="space-y-4 text-center">
                <h2 className="text-xl font-bold">Pague com Pix</h2>
                <p className="text-sm text-muted-foreground">Abra o app do seu banco, escolha Pix e leia o código ou use o copia e cola.</p>
                {pix.qrcode && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pixImageSrc(pix.qrcode)} alt="QR Code do Pix" className="mx-auto h-52 w-52 rounded-xl border border-border bg-white p-2" />
                )}
                <div className="rounded-xl bg-muted p-3 text-xs break-all text-left max-h-24 overflow-auto">{pix.emv}</div>
                <Button onClick={copyPix} className="w-full h-12 rounded-xl">
                  <Copy className="w-4 h-4 mr-2" /> Copiar código Pix
                </Button>
                <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Aguardando o pagamento. A tela atualiza sozinha.
                </p>
              </div>
            ) : waiting === "card" ? (
              <div className="py-10 text-center space-y-3">
                <Loader2 className="mx-auto w-10 h-10 animate-spin text-primary" />
                <h2 className="text-xl font-bold">Confirmando seu pagamento</h2>
                <p className="text-sm text-muted-foreground">Isso costuma levar alguns segundos. Não feche esta página.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold">Pagamento</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Plano {current.name}: R$ {current.price}/mês
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Forma de pagamento">
                  {([
                    ["pix", "Pix", QrCode],
                    ["card", "Cartão", CreditCard],
                  ] as const).map(([id, label, Icon]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={method === id}
                      onClick={() => setMethod(id)}
                      className={`flex items-center justify-center gap-2 h-12 rounded-xl border text-sm font-semibold transition-colors ${
                        method === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" inputMode="numeric" required placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Celular</Label>
                      <Input id="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} />
                    </div>
                  </div>

                  {method === "card" && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="cc-number">Número do cartão</Label>
                        <Input id="cc-number" autoComplete="cc-number" inputMode="numeric" required placeholder="0000 0000 0000 0000" value={card.number} onChange={(e) => setCard({ ...card, number: maskCard(e.target.value) })} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="cc-exp">Validade</Label>
                          <Input id="cc-exp" autoComplete="cc-exp" inputMode="numeric" required placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: maskExp(e.target.value) })} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cc-cvv">CVV</Label>
                          <Input id="cc-cvv" autoComplete="cc-csc" inputMode="numeric" required maxLength={4} placeholder="123" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cc-name">Nome impresso no cartão</Label>
                        <Input id="cc-name" autoComplete="cc-name" value={card.holderName} placeholder={name || "Como está no cartão"} onChange={(e) => setCard({ ...card, holderName: e.target.value })} />
                      </div>
                    </>
                  )}
                </div>

                {error && (
                  <p role="alert" className="rounded-xl bg-destructive/10 text-destructive text-sm px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" disabled={submitting} className="w-full h-14 rounded-xl text-base font-semibold">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : method === "pix" ? "Gerar Pix" : `Pagar R$ ${current.price}`}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Pagamento seguro
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Processado pela Appmax
                  </span>
                </div>

                {isNewUser && (
                  <p className="text-center text-sm text-muted-foreground">
                    Prefere testar antes?{" "}
                    <Link href="/onboarding" className="font-semibold text-primary hover:underline">
                      Usar 7 dias grátis, sem cartão
                    </Link>
                  </p>
                )}
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  )
}
