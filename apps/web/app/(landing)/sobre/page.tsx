import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sobre a Dona da Revenda",
}

export default function SobrePage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Sobre a Dona da Revenda</h1>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">História</h2>
                    <p>A Dona da Revenda nasceu da dor real de quem vive o dia a dia das vendas diretas. Criada em 2024 por empreendedores que cresceram vendendo cosméticos nas ruas do Brasil, entendemos que a tecnologia deveria ser aliada da revendedora, não mais uma complicação. Hoje, somos a primeira plataforma do Brasil a oferecer inteligência artificial nativa para quem vende Natura, Avon, Boticário e outras marcas. Nossa missão é empoderar milhões de mulheres a profissionalizarem seus negócios e conquistarem sua independência financeira.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Missão</h2>
                    <p className="text-lg text-purple-600 font-medium">Transformar revendedores em empresários da beleza, através da tecnologia e inteligência artificial acessível.</p>
                </section>

                <section className="bg-purple-50 dark:bg-purple-950/20 p-8 rounded-2xl">
                    <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Números</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                            <div className="font-medium text-foreground">Revendedoras ativas</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">R$ 2.4M</div>
                            <div className="font-medium text-foreground">Em vendas gerenciadas</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">94%</div>
                            <div className="font-medium text-foreground">Satisfação dos clientes</div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Time</h2>
                    <p>Somos um time diverso de desenvolvedores, designers e especialistas em vendas diretas, unidos pelo propósito de democratizar o acesso à tecnologia de ponta para microempreendedoras.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Onde Estamos</h2>
                    <p><strong>Sede:</strong> São Paulo, SP - Brasil.<br /><strong>Atuação:</strong> 100% digital, atendendo todo o território nacional.</p>
                </section>
            </div>
        </div>
    )
}
