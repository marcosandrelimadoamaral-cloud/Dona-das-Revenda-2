import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
    title: "Fale Conosco | Dona da Revenda",
}

export default function ContatoPage() {
    return (
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Fale Conosco</h1>
                <p className="text-xl text-muted-foreground">Estamos aqui para ajudar você a ter mais sucesso nas vendas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Coluna Esquerda - Informações */}
                <div className="space-y-10">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            Email
                        </h3>
                        <p className="text-muted-foreground">suporte@donadarevenda.com.br</p>
                        <p className="text-muted-foreground">comercial@donadarevenda.com.br</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            Telefone/WhatsApp
                        </h3>
                        <p className="text-lg text-foreground font-medium">(11) 4000-1234</p>
                        <p className="text-sm text-muted-foreground">Seg-Sex, 9h às 18h</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            Endereço
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Av. Paulista, 1000 - Sala 501<br />
                            Bela Vista, São Paulo - SP<br />
                            CEP: 01310-100
                        </p>
                    </div>
                </div>

                {/* Coluna Direita - Formulário */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>
                            <Input id="nome" placeholder="Seu nome completo" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="seu@email.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assunto">Assunto</Label>
                            <select
                                id="assunto"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Selecione...</option>
                                <option value="suporte">Suporte Técnico</option>
                                <option value="vendas">Vendas/Comercial</option>
                                <option value="parcerias">Parcerias</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mensagem">Mensagem</Label>
                            <textarea
                                id="mensagem"
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Digite sua mensagem aqui..."
                            />
                        </div>

                        <Button type="button" className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2">
                            Enviar Mensagem
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
