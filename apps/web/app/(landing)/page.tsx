import { HeroSection } from "@/components/landing/HeroSection"
import { BrandsMarquee } from "@/components/landing/BrandsMarquee"
import { ProblemSolution } from "@/components/landing/ProblemSolution"
import { AgentsShowcase } from "@/components/landing/AgentsShowcase"
import { FeaturesBento } from "@/components/landing/FeaturesBento"
import { ComparisonTable } from "@/components/landing/ComparisonTable"
import { SocialProof } from "@/components/landing/SocialProof"
import { Pricing } from "@/components/landing/Pricing"
import { Faq } from "@/components/landing/Faq"
import { CtaFinal } from "@/components/landing/CtaFinal"
import { Footer } from "@/components/landing/Footer"
import { Navbar } from "@/components/landing/Navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <BrandsMarquee />
        <ProblemSolution />
        <AgentsShowcase />
        <FeaturesBento />
        <ComparisonTable />
        <SocialProof />
        <Pricing />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
