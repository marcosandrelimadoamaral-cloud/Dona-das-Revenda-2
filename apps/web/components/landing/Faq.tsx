"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Preciso saber usar tecnologia/computador?",
    answer: "Não! A Dona da Revenda foi desenhada para ser tão fácil quanto usar o WhatsApp. Além disso, a Clara (nossa IA) aprende com você e sugere o que fazer a cada passo."
  },
  {
    question: "E se eu vender de várias marcas (Natura, Avon, Boticário)?",
    answer: "É exatamente para isso que existimos. Unificamos todas as suas marcas em um só lugar. Você não precisa mais ter 3 cadernos diferentes."
  },
  {
    question: "Funciona sem internet?",
    answer: "Sim! O aplicativo funciona offline. Você pode registrar vendas na rua ou em feiras sem internet, e ele sincroniza tudo automaticamente quando você conectar no Wi-Fi."
  },
  {
    question: "Como a IA sabe o que postar no meu Instagram?",
    answer: "A Clara analisa o seu estoque atual (para focar no que você precisa vender), as tendências do momento nas redes sociais e o seu estilo de comunicação para gerar roteiros que realmente engajam o seu público."
  },
  {
    question: "É seguro? Minhas informações estão protegidas?",
    answer: "Sim, usamos criptografia de nível bancário e seguimos a LGPD rigorosamente. Seus dados de clientes e vendas são seus e nunca serão compartilhados."
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, sem taxa de cancelamento ou fidelidade. Você pode exportar todos os seus dados para uma planilha a qualquer momento se decidir sair."
  }
]

export function Faq() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-200 dark:border-gray-800">
              <AccordionTrigger className="text-left text-base font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
