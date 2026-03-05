import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Blog | Dona da Revenda",
}

export default function BlogPage() {
    const posts = [
        {
            title: "Como a IA está revolucionando as vendas de cosméticos",
            excerpt: "Descubra como usar inteligência artificial para criar conteúdo que converte e economize horas por semana...",
            date: "15/01/2025",
            category: "Tecnologia",
            time: "5 min"
        },
        {
            title: "5 dicas para organizar seu estoque em 2025",
            excerpt: "Aprenda a nunca mais perder produtos por validade vencida e otimize seu capital de giro...",
            date: "10/01/2025",
            category: "Gestão",
            time: "3 min"
        },
        {
            title: "Como vender mais no WhatsApp",
            excerpt: "Estratégias comprovadas para aumentar suas vendas usando o aplicativo que seus clientes já usam todos os dias...",
            date: "05/01/2025",
            category: "Vendas",
            time: "4 min"
        }
    ]

    return (
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
                <p className="text-xl text-muted-foreground">Dicas, tutoriais e novidades para revendedores de sucesso</p>
            </div>

            <div className="grid gap-8">
                {posts.map((post, i) => (
                    <article key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="text-purple-600 font-medium bg-purple-50 dark:bg-purple-900/20 px-2.5 py-0.5 rounded-full">{post.category}</span>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>Leitura de {post.time}</span>
                        </div>
                        <h2 className="text-2xl font-semibold mb-3">
                            <Link href="#" className="hover:text-purple-600 transition-colors">{post.title}</Link>
                        </h2>
                        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                        <Link href="#" className="text-purple-600 font-medium hover:text-purple-700">Ler artigo completo →</Link>
                    </article>
                ))}
            </div>
        </div>
    )
}
