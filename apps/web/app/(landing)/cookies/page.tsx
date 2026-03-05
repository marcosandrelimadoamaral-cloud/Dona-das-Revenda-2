import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Política de Cookies | Dona da Revenda",
}

export default function CookiesPage() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Política de Cookies</h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">O que são</h2>
                    <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles nos ajudam a fazer a plataforma funcionar corretamente.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Essenciais</h2>
                    <p>Estes cookies são necessários para o funcionamento básico da plataforma. Sem eles, o site não funcionaria corretamente. Incluem: autenticação de usuário (session_id); segurança (csrf_token); preferências básicas (tema, idioma).</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Analíticos</h2>
                    <p>Ajudam-nos a entender como os visitantes interagem com a plataforma, identificando áreas de melhoria. Incluem: Google Analytics; métricas de uso de funcionais.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Funcionais</h2>
                    <p>Permitem lembrar suas preferências para personalizar sua experiência. Incluem: configurações de exibição; lembretes de login.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Como Gerenciar</h2>
                    <p>Você pode controlar e/ou excluir cookies como desejar. Saiba mais em aboutcookies.org. Você pode excluir todos os cookies já armazenados no seu computador e configurar a maioria dos navegadores para bloqueá-los. Mas se fizer isso, talvez tenha que ajustar manualmente algumas preferências sempre que visitar um site, e alguns serviços podem não funcionar.</p>
                </section>
            </div>
        </div>
    )
}
