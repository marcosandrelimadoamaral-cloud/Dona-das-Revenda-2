import { HeroSection } from "@/components/landing/HeroSection"
import { ProblemSolution } from "@/components/landing/ProblemSolution"
import { AgentsShowcase } from "@/components/landing/AgentsShowcase"
import { FeaturesBento } from "@/components/landing/FeaturesBento"
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
