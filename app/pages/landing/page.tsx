import { Header } from "@/app/_components/landing/header"
import { Hero } from "@/app/_components/landing/hero"
import { Features } from "@/app/_components/landing/features"
import { Pricing } from "@/app/_components/landing/pricing"
import { Footer } from "@/app/_components/landing/footer"
import { Steps } from "@/app/_components/landing/steps"

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

