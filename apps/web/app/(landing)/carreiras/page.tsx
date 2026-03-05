import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Trabalhe Conosco | Dona da Revenda",
}

export default function CarreirasPage() {
    const vagas = [
        {
            title: "Desenvolvedor Full Stack",
            type: "Remoto",
            level: "Pleno/Sênior",
            description: "Trabalhar no desenvolvimento de novas funcionalidades da plataforma usando Next.js e Node.js."
        },
        {
            title: "Customer Success",
            type: "Remoto",
            level: "Júnior/Pleno",
            description: "Ajudar nossas revendedoras a terem sucesso na plataforma, com suporte e treinamentos."
        },
        {
            title: "Especialista em Marketing Digital",
            type: "Híbrido - SP",
            level: "Pleno",
            description: "Criar estratégias de crescimento e conteúdo para atrair novos usuários."
        }
    ]

    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Trabalhe Conosco</h1>
                <p className="text-xl text-muted-foreground">Faça parte da revolução da beleza no Brasil. Procuramos pessoas apaixonadas por tecnologia e impacto social.</p>
            </div>

            <div className="space-y-6">
                {vagas.map((vaga, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 justify-between items-start">
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-2">{vaga.title}</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm px-3 py-1 rounded-full font-medium">{vaga.type}</span>
                                <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm px-3 py-1 rounded-full font-medium">{vaga.level}</span>
                            </div>
                            <p className="text-muted-foreground">{vaga.description}</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto">
                            Candidatar-se
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center bg-purple-50 dark:bg-purple-950/20 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-2">Não encontrou sua vaga?</h3>
                <p className="text-muted-foreground mb-4">Envie seu currículo e entraremos em contato quando surgir uma oportunidade.</p>
                <a href="mailto:rh@donadarevenda.com.br" className="text-purple-600 font-medium bg-white dark:bg-zinc-900 px-6 py-3 rounded-lg border border-purple-100 dark:border-purple-800 inline-block hover:border-purple-300 transition-colors">rh@donadarevenda.com.br</a>
            </div>
        </div>
    )
}
