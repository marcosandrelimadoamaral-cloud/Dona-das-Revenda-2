import { Sparkles, TrendingUp, MessageCircle, Package, Calendar } from "lucide-react"

const agents = [
  { icon: Sparkles, name: "Clara", role: "Criadora de Conteúdo", superpower: "Cria 30 dias de conteúdo em 5 minutos" },
  { icon: TrendingUp, name: "Finn", role: "CFO Virtual", superpower: "Prevê seu caixa dos próximos 30 dias" },
  // Zara: o código escreve mensagens prontas e simula clientes para treino; não fecha venda sozinha.
  { icon: MessageCircle, name: "Zara", role: "Vendas WhatsApp", superpower: "Escreve a mensagem pronta e treina seu atendimento" },
  { icon: Package, name: "Nina", role: "Gestão de Estoque", superpower: "Prevê rupturas e sugere reposição" },
  { icon: Calendar, name: "Lia", role: "Assistente Pessoal", superpower: "Organiza seu dia e otimiza rotas" },
]

export function AgentsShowcase() {
  return (
    <section id="agentes" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Conheça seu novo time de funcionários que nunca dormem
          </h2>
          <p className="text-xl text-muted-foreground">5 especialistas de IA trabalhando para você, pelo preço de um lanche</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(({ icon: Icon, name, role, superpower }) => (
            <article
              key={name}
              className="rounded-2xl bg-white dark:bg-card border border-border p-7 shadow-soft hover:shadow-lift transition-shadow"
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="h-12 w-12 rounded-full bg-brand-grena text-brand-marfim grid place-items-center">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold leading-none">{name}</h3>
                  <p className="text-xs uppercase tracking-widest text-brand-ouro-escuro mt-1.5">{role}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-brand-grena mb-1">Superpoder</p>
              <p className="text-foreground leading-relaxed">{superpower}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
