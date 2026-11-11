"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionHeading } from "@/components/brand/SectionHeading"

const faqs = [
  {
    question: "Preciso saber usar tecnologia?",
    answer:
      "Não. A Dona da Revenda foi pensada para ser tão simples quanto usar o WhatsApp, e os assistentes de IA sugerem o próximo passo em cada tela.",
  },
  {
    question: "Posso usar com várias marcas ao mesmo tempo?",
    answer:
      "Pode. Natura, Avon, Boticário e outras ficam juntas no mesmo catálogo e no mesmo estoque. Chega de um caderno para cada marca.",
  },
  {
    question: "Como a Clara sabe o que sugerir para o meu Instagram?",
    answer:
      "Ela olha o que você tem em estoque e o seu jeito de comunicar para sugerir posts e roteiros. Você revisa e publica como preferir.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Seguimos a LGPD. Os dados dos seus clientes e das suas vendas são seus e não são compartilhados com terceiros. Detalhes na nossa página de Privacidade.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim, sem multa e sem fidelidade. Se decidir sair, você exporta seus dados para uma planilha.",
  },
]

export function Faq() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`} className="border-brand-linho dark:border-border">
              <AccordionTrigger className="text-left font-display text-lg font-semibold hover:no-underline hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
