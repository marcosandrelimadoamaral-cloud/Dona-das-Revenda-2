import { CalendarX, Ghost, Clock, HelpCircle, Brain, TrendingUp, ShoppingCart, CheckCircle2, Sparkles } from "lucide-react"

const painPoints = [
  { icon: CalendarX, text: "Estoque parado perdendo validade = dinheiro no lixo" },
  { icon: Ghost, text: "Clientes somem porque você esqueceu de fazer follow-up" },
  { icon: Clock, text: "Passa horas tentando criar conteúdo e ninguém engaja" },
  { icon: HelpCircle, text: "Não sabe se está lucrando ou só 'girando' dinheiro" },
]

const solutions = [
  { icon: Brain, text: "5 IAs especializadas cuidam do que você odeia fazer" },
  { icon: TrendingUp, text: "Dashboard financeiro em tempo real — lucro real, não achismo" },
  { icon: ShoppingCart, text: "PDV, fiados e estoque integrados — zero planilha" },
  { icon: CheckCircle2, text: "Conteúdo para Instagram e WhatsApp gerado em segundos" },
]

export function ProblemSolution() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-grena mb-3">O problema</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Você trabalha mais que o suficiente.
              <br />
              <span className="text-brand-grena">Mas os resultados não aparecem.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Enquanto isso, as grandes consultoras usam tecnologia que você não tem acesso... Até agora.
            </p>
            <div className="space-y-3">
              {painPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="p-2.5 rounded-lg bg-brand-quartzo-claro text-brand-grena shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] rounded-3xl bg-brand-grena text-brand-marfim p-8 flex flex-col justify-center shadow-lift">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-bold w-fit">
                <Sparkles className="w-4 h-4 text-brand-ouro" /> A Solução Definitiva
              </div>
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">A Dona da Revenda é sua sócia que nunca descansa.</h3>
              <p className="text-lg text-brand-quartzo-claro leading-relaxed">
                Ela não dorme, não esquece e trabalha 24h por você. Deixe a IA cuidar do trabalho chato enquanto você foca no que
                importa: suas clientes.
              </p>
              <div className="space-y-3 pt-2">
                {solutions.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
