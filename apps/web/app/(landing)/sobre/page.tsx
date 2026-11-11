import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sobre nós",
    description: "Por que a Dona da Revenda existe: ajudar quem revende beleza a organizar o negócio, ganhar tempo e vender com mais clareza.",
    alternates: { canonical: "/sobre" },
}

export default function SobrePage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Sobre a Dona da Revenda</h1>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Por que existimos</h2>
                    <p>Quem revende beleza tem um negócio de verdade: estoque, clientes, fiados, entregas, redes sociais. Quase sempre tudo isso vive num caderno, numa planilha e em dezenas de conversas de WhatsApp. A Dona da Revenda reúne esse trabalho num só lugar e coloca assistentes de inteligência artificial para ajudar, sempre com a revendedora no comando.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Missão</h2>
                    <p className="text-lg text-brand-grena dark:text-brand-quartzo font-medium">Ajudar quem revende beleza a organizar o negócio, ganhar tempo e vender com mais clareza.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">No que acreditamos</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>A dona é você.</strong> A tecnologia trabalha para a revendedora, não o contrário.</li>
                        <li><strong>Simples antes de sofisticado.</strong> Se é difícil de usar, não serve.</li>
                        <li><strong>Transparência.</strong> Preço claro, dados seus e cancelamento sem burocracia.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Fale com a gente</h2>
                    <p>Dúvidas, sugestões ou parcerias: use a página de <a href="/contato" className="text-brand-grena dark:text-brand-quartzo underline underline-offset-4">contato</a>.</p>
                </section>
            </div>
        </div>
    )
}
