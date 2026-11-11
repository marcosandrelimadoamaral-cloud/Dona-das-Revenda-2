import { faqs } from "@/lib/faqs"

export const SITE_URL = "https://donadarevenda.com.br"
export const SITE_NAME = "Dona da Revenda"

export const SITE_DESCRIPTION =
  "Gestão para quem revende beleza: vendas, estoque, clientes, fiados e financeiro num só lugar, com 5 assistentes de IA. Teste 7 dias grátis."

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    description: SITE_DESCRIPTION,
  }
}

export function softwareApplicationJsonLd() {
  // Sem aggregateRating de propósito: só entra quando houver avaliações reais.
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android, iOS (PWA)",
    inLanguage: "pt-BR",
    description:
      "Plataforma de gestão para revendedoras de cosméticos e beleza: vendas, estoque, clientes, fiados, financeiro e agenda, com cinco assistentes de IA.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "47.50",
      highPrice: "97.00",
      offerCount: 3,
    },
  }
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}
