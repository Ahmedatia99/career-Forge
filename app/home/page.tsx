import { Header } from "@/app/_components/home-page/header"
import { Hero } from "@/app/_components/home-page/hero"
import { Features } from "@/app/_components/home-page/features"
import { Pricing } from "@/app/_components/home-page/pricing"
import { Footer } from "@/app/_components/home-page/footer"
import { Steps } from "@/app/_components/home-page/steps"
import { DashboardHeader } from '@/app/_components/dashboard-header';

export default function LandingPage() {
  return (
    <main className="bg-background">
      <DashboardHeader />
      <Hero />
      <Features />
      <Steps />
      <Pricing />
      <Footer />
    </main>
  )
}

