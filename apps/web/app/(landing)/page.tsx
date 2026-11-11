import type { Metadata } from "next"
import { organizationJsonLd, softwareApplicationJsonLd, faqJsonLd, SITE_DESCRIPTION } from "@/lib/seo"
import { HeroSection } from "@/components/landing/HeroSection"
import { BrandsMarquee } from "@/components/landing/BrandsMarquee"
import { ProblemSolution } from "@/components/landing/ProblemSolution"
import { AgentsShowcase } from "@/components/landing/AgentsShowcase"
import { FeaturesBento } from "@/components/landing/FeaturesBento"
import { Pricing } from "@/components/landing/Pricing"
import { Faq } from "@/components/landing/Faq"
import { CtaFinal } from "@/components/landing/CtaFinal"
import { Footer } from "@/components/landing/Footer"
import { Navbar } from "@/components/landing/Navbar"

export const metadata: Metadata = {
  title: { absolute: "Dona da Revenda | Gestão para revendedoras de cosméticos" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
}

const jsonLd = [organizationJsonLd(), softwareApplicationJsonLd(), faqJsonLd()]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
      <Navbar />
      <main>
        <HeroSection />
        <BrandsMarquee />
        <ProblemSolution />
        <AgentsShowcase />
        <FeaturesBento />
        <Pricing />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
