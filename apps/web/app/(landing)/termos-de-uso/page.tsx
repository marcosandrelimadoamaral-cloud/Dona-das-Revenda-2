import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Termos de Uso | Dona da Revenda",
}

export default function TermosPage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Termos de Uso</h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 1 - Aceitação dos Termos</h2>
                    <p>Ao acessar e usar a plataforma Dona da Revenda, você concorda em cumprir e estar vinculado aos presentes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 2 - Descrição do Serviço</h2>
                    <p>A Dona da Revenda é uma plataforma de software como serviço (SaaS) que oferece ferramentas de gestão para revendedores de cosméticos e produtos de beleza, incluindo: gestão de estoque e controle de validade; registro e acompanhamento de clientes (CRM); emissão de pedidos e controle financeiro; ferramentas de inteligência artificial para criação de conteúdo e atendimento; integração com WhatsApp Business.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 3 - Cadastro e Conta</h2>
                    <p>Para utilizar a plataforma, você deve: ser maior de 18 anos ou possuir autorização legal; fornecer informações verdadeiras, precisas e completas; manter sua senha e dados de acesso em segurança; ser responsável por todas as atividades em sua conta.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 4 - Planos e Pagamentos</h2>
                    <p>Oferecemos planos gratuitos e pagos: Plano Free: Gratuito com limitações de uso; Plano Pro: R$ 97/mês ou R$ 930/ano; Plano Business: R$ 197/mês ou R$ 1.890/ano. Pagamentos são processados via Stripe e Mercado Pago. O não pagamento resultará na suspensão dos serviços premium.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 5 - Uso da Inteligência Artificial</h2>
                    <p>Nossos agentes de IA (Clara, Finn, Zara, Nina, Lia) são ferramentas de auxílio: não garantimos 100% de precisão nas sugestões; você é responsável por revisar conteúdo antes de publicar; não nos responsabilizamos por decisões de negócio tomadas baseadas nas análises.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 6 - Propriedade Intelectual</h2>
                    <p>A Dona da Revenda detém todos os direitos sobre a plataforma. Você mantém os direitos sobre seus dados inseridos. É proibido copiar, modificar ou distribuir o software sem autorização.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 7 - Limitação de Responsabilidade</h2>
                    <p>Não nos responsabilizamos por: perda de dados por falha de backup do usuário; interrupções de serviço por manutenção ou falhas técnicas; perdas financeiras decorrentes do uso da plataforma; conduta de terceiros (ex: clientes finais).</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 8 - Cancelamento</h2>
                    <p>Você pode cancelar sua conta a qualquer momento. Os dados serão mantidos por 30 dias após o cancelamento para possível recuperação, após o que serão permanentemente excluídos.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 9 - Alterações nos Termos</h2>
                    <p>Podemos atualizar estes termos periodicamente. Notificaremos você sobre mudanças significativas por email ou através da plataforma.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seção 10 - Contato</h2>
                    <p>Dúvidas sobre estes termos: suporte@donadarevenda.com.br</p>
                </section>
            </div>
        </div>
    )
}
