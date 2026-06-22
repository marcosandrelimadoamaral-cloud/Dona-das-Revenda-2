# Dona da Revenda

Sistema de gestão para revendedoras — controle de clientes, produtos, pedidos e financeiro em um único lugar.

## Stack

- **Frontend / Web:** Next.js 14, TypeScript, Tailwind CSS, Radix UI, Recharts
- **Mobile:** React Native (Expo)
- **Backend:** Supabase (banco de dados + autenticação)
- **Pagamentos:** Stripe
- **Monorepo:** Turborepo

## Estrutura

```
apps/
  web/        # App web (Next.js)
  mobile/     # App mobile (Expo)
packages/
  ui/         # Componentes compartilhados
  database/   # Tipos e cliente Supabase
  config/     # Configurações (ESLint, TS)
  ai-agents/  # Agentes de IA
```

## Rodando localmente

**Pré-requisitos:** Node.js 18+, npm

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente — copie o arquivo de exemplo e preencha as chaves:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Variáveis necessárias:
   | Variável | Descrição |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
   | `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe |

3. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

   O app web estará disponível em `http://localhost:3000`.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia todos os apps em desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run lint` | Verifica tipos e lint |
