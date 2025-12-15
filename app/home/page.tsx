import { Header } from "@/app/_components/home-page/header"
import { Hero } from "@/app/_components/home-page/hero"
import { Features } from "@/app/_components/home-page/features"
import { Pricing } from "@/app/_components/home-page/pricing"
import { Footer } from "@/app/_components/home-page/footer"
import { Steps } from "@/app/_components/home-page/steps"

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

