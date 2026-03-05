import { Metadata } from "next"

export const metadata: Metadata = {
    title: "LGPD | Dona da Revenda",
}

export default function LgpdPage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight mb-8">LGPD - Lei Geral de Proteção de Dados</h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Compromisso</h2>
                    <p>A Dona da Revenda está plenamente em conformidade com a Lei nº 13.709/2018 (LGPD). Respeitamos sua privacidade e protegemos seus dados pessoais com rigor.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Base Legal</h2>
                    <p>Tratamos seus dados com base em: Execução de contrato (para prestar os serviços contratados); Consentimento (quando necessário, solicitamos sua autorização explícita); Legítimo interesse (para melhorias na plataforma e prevenção de fraudes); Obrigação legal (para cumprimento de obrigações fiscais e regulatórias).</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Dados Sensíveis</h2>
                    <p>Não coletamos dados sensíveis conforme definição da LGPD (origem racial, convicção religiosa, opinião política, etc.), exceto: dados financeiros (necessários para pagamentos); dados de saúde (tipo de pele, apenas se fornecido voluntariamente para recomendações de produtos). Esses dados recebem tratamento especial de segurança.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Direitos</h2>
                    <p>Para exercer seus direitos sob a LGPD (acesso, correção, exclusão, portabilidade, etc.): Email privacidade@donadarevenda.com.br - Resposta em até 15 dias úteis - Sem custos para solicitações razoáveis</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Incidentes</h2>
                    <p>Em caso de vazimento de dados, notificaremos a ANPD e os titulares afetados em até 72 horas, conforme exigido pela lei.</p>
                </section>
            </div>
        </div>
    )
}
