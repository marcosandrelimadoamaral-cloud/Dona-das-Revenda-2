"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/lib/faqs"

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-grena mb-3">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-muted-foreground">Tudo que você precisa saber antes de começar.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`} className="border-brand-linho dark:border-border">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline hover:text-primary">
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
