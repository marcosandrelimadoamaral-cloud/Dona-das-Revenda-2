import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Política de Privacidade | Dona da Revenda",
}

export default function PrivacidadePage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Política de Privacidade</h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Introdução</h2>
                    <p>A Dona da Revenda está comprometida em proteger sua privacidade. Esta política explica como coletamos, usamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Dados Coletados</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Dados de Cadastro:</strong> Nome, email, telefone, dados de pagamento.</li>
                        <li><strong>Dados de Uso:</strong> Informações sobre produtos, clientes, vendas inseridas na plataforma.</li>
                        <li><strong>Dados Técnicos:</strong> IP, navegador, dispositivo, cookies.</li>
                        <li><strong>Dados de Comunicação:</strong> Histórico de WhatsApp (se integrado), mensagens com nossos agentes de IA.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Finalidade</h2>
                    <p>Utilizamos seus dados para: prestar os serviços contratados; personalizar a experiência com IA; processar pagamentos; enviar comunicações sobre a plataforma; cumprir obrigações legais; melhorar nossos serviços.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Compartilhamento</h2>
                    <p>Seus dados podem ser compartilhados com: Processadores de Pagamento (Stripe, Mercado Pago); Serviços de IA (Google AI - dados anonimizados para geração de conteúdo); Provedores de Infraestrutura (Supabase, Vercel); Autoridades Legais (quando exigido por lei). Não vendemos seus dados para terceiros para fins de marketing.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Segurança</h2>
                    <p>Adotamos medidas técnicas e administrativas para proteger seus dados: criptografia SSL/TLS em trânsito; criptografia AES-256 em repouso; autenticação de dois fatores (2FA) opcional; controles de acesso baseados em função (RBAC); backups diários.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Seus Direitos (LGPD)</h2>
                    <p>Você tem direito a: acessar seus dados; corrigir dados incompletos ou desatualizados; solicitar anonimização, bloqueio ou eliminação; portabilidade dos dados para outro serviço; revogar consentimento; informação sobre compartilhamento. Para exercer esses direitos: privacidade@donadarevenda.com.br</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
                    <p>Utilizamos cookies essenciais (funcionamento), analíticos (melhorias) e de preferências (idioma, tema). Você pode gerenciar cookies nas configurações do navegador.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Retenção</h2>
                    <p>Mantemos seus dados enquanto sua conta estiver ativa. Após cancelamento, dados são excluídos em 30 dias, exceto quando há obrigação legal de retenção.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Contato DPO</h2>
                    <p>Encarregado de Dados (DPO): privacidade@donadarevenda.com.br</p>
                </section>
            </div>
        </div>
    )
}
