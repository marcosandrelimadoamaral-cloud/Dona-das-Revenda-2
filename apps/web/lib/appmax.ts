// Cliente da API da Appmax (https://appmax.readme.io).
// Só roda no servidor: usa credenciais secretas e nunca deve ir para o navegador.

export type PlanId = "monthly" | "quarterly" | "annual"

type Env = { auth: string; api: string }

const ENVS: Record<"sandbox" | "production", Env> = {
  sandbox: { auth: "https://auth.sandboxappmax.com.br", api: "https://api.sandboxappmax.com.br" },
  production: { auth: "https://auth.appmax.com.br", api: "https://api.appmax.com.br" },
}

// Sandbox por padrão: só vai para produção com APPMAX_ENV=production.
export function appmaxEnv(): "sandbox" | "production" {
  return process.env.APPMAX_ENV === "production" ? "production" : "sandbox"
}

export function appmaxConfigured() {
  return Boolean(process.env.APPMAX_CLIENT_ID && process.env.APPMAX_CLIENT_SECRET)
}

export class AppmaxError extends Error {
  status: number
  constructor(message: string, status = 502) {
    super(message)
    this.name = "AppmaxError"
    this.status = status
  }
}

// ---------------------------------------------------------------- planos

export const APPMAX_PLANS: Record<
  PlanId,
  { name: string; cents: number; interval: "monthly"; intervalCount: number; months: number; label: string }
> = {
  monthly: { name: "Mensal", cents: 9700, interval: "monthly", intervalCount: 1, months: 1, label: "R$ 97,00 por mês" },
  quarterly: { name: "Trimestral", cents: 26100, interval: "monthly", intervalCount: 3, months: 3, label: "R$ 261,00 a cada 3 meses" },
  annual: { name: "Anual", cents: 57000, interval: "monthly", intervalCount: 12, months: 12, label: "R$ 570,00 por ano" },
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "monthly" || value === "quarterly" || value === "annual"
}

// ---------------------------------------------------------------- utilidades

export const onlyDigits = (v: string) => (v ?? "").replace(/\D/g, "")

// CPF com dígitos verificadores (a Appmax rejeita CPF inválido).
export function isValidCpf(raw: string) {
  const cpf = onlyDigits(raw)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const calc = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i)
    const mod = (sum * 10) % 11
    return mod === 10 ? 0 : mod
  }
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10])
}

// Appmax usa estes status em português.
export const PAID_STATUSES = new Set(["aprovado", "integrado"])

// ---------------------------------------------------------------- HTTP

let cachedToken: { value: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (!appmaxConfigured()) throw new AppmaxError("Pagamento ainda não configurado.", 503)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const { auth } = ENVS[appmaxEnv()]
  const res = await fetch(`${auth}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.APPMAX_CLIENT_ID!,
      client_secret: process.env.APPMAX_CLIENT_SECRET!,
    }),
    cache: "no-store",
  })
  if (!res.ok) throw new AppmaxError("Não foi possível autenticar na Appmax.", 502)
  const json = (await res.json()) as { access_token: string; expires_in?: number }
  cachedToken = { value: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 }
  return cachedToken.value
}

async function call<T = any>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const { api } = ENVS[appmaxEnv()]
  const token = await getToken()
  const res = await fetch(`${api}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })
  const text = await res.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    /* resposta sem JSON */
  }
  if (res.status === 401) cachedToken = null
  if (!res.ok) {
    // Não registra o corpo da requisição (pode conter dados de cartão).
    const detail = json?.message || json?.error || `HTTP ${res.status}`
    throw new AppmaxError(typeof detail === "string" ? detail : "Erro na Appmax.", res.status >= 500 ? 502 : 400)
  }
  return json as T
}

// ---------------------------------------------------------------- operações

export type CustomerInput = {
  name: string
  email: string
  phone: string
  cpf: string
  ip?: string
}

export async function createCustomer(input: CustomerInput): Promise<number> {
  const [first, ...rest] = input.name.trim().split(/\s+/)
  const json = await call("POST", "/v1/customers", {
    first_name: first || "Cliente",
    last_name: rest.join(" ") || "Dona da Revenda",
    email: input.email,
    phone: onlyDigits(input.phone),
    document_number: onlyDigits(input.cpf),
    ip: input.ip || "127.0.0.1",
  })
  const id = json?.data?.customer?.id
  if (!id) throw new AppmaxError("A Appmax não aceitou os dados do cliente. Confira o CPF e o telefone.", 400)
  return Number(id)
}

export async function createOrder(customerId: number, plan: PlanId): Promise<number> {
  const p = APPMAX_PLANS[plan]
  const json = await call("POST", "/v1/orders", {
    customer_id: customerId,
    products_value: p.cents,
    discount_value: 0,
    shipping_value: 0,
    products: [
      { sku: `dona-da-revenda-${plan}`, name: `Dona da Revenda ${p.name}`, quantity: 1, unit_value: p.cents, type: "digital" },
    ],
  })
  const id = json?.data?.order?.id
  if (!id) throw new AppmaxError("Não foi possível criar o pedido.", 502)
  return Number(id)
}

export type CardInput = {
  number: string
  cvv: string
  expMonth: string
  expYear: string
  holderName: string
  holderCpf: string
}

export async function payWithCard(orderId: number, customerId: number, plan: PlanId, card: CardInput) {
  const p = APPMAX_PLANS[plan]
  const json = await call("POST", "/v1/payments/credit-card", {
    order_id: orderId,
    customer_id: customerId,
    payment_data: {
      credit_card: {
        number: onlyDigits(card.number),
        cvv: onlyDigits(card.cvv),
        expiration_month: card.expMonth.padStart(2, "0"),
        expiration_year: card.expYear.length === 2 ? `20${card.expYear}` : card.expYear,
        holder_name: card.holderName.toUpperCase(),
        holder_document_number: onlyDigits(card.holderCpf),
        installments: 1,
        soft_descriptor: "DONADAREVENDA",
      },
      subscription: { interval: p.interval, interval_count: p.intervalCount },
    },
  })
  const payment = json?.data?.payment
  // pay_reference vazio indica cartão recusado.
  return { approved: Boolean(payment?.pay_reference), status: String(payment?.status ?? "") }
}

export async function payWithPix(orderId: number, plan: PlanId, cpf: string) {
  const p = APPMAX_PLANS[plan]
  const json = await call("POST", "/v1/payments/pix", {
    order_id: orderId,
    payment_data: {
      pix: { document_number: onlyDigits(cpf) },
      subscription: { interval: p.interval, interval_count: p.intervalCount },
    },
  })
  const payment = json?.data?.payment
  if (!payment?.pix_emv) throw new AppmaxError("Não foi possível gerar o Pix. Tente novamente.", 502)
  return { qrcode: String(payment.pix_qrcode ?? ""), emv: String(payment.pix_emv) }
}

export async function getOrder(orderId: number) {
  const json = await call("GET", `/v1/orders/${orderId}`)
  const order = json?.data?.order
  return {
    id: Number(order?.id ?? orderId),
    status: String(order?.status ?? ""),
    customerId: json?.data?.customer?.id ? Number(json.data.customer.id) : null,
    email: (json?.data?.customer?.email as string | undefined) ?? null,
  }
}
