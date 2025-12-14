import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"
import { Steps } from "@/components/landing/steps"

export default function LandingPage() {
  return (
    <main className="bg-background">
      <Header />
      <Hero />
      <Features />
      <Steps />
      <Pricing />
      <Footer />
    </main>
  )
}

