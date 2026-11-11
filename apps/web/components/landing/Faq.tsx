"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionHeading } from "@/components/brand/SectionHeading"
import { faqs } from "@/lib/faqs"

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background scroll-mt-20">
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
