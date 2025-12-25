import { DashboardHeader } from "@/app/_components/dashboard-header";
import { HeroSection } from "@/app/_components/about-page/hero";
import { StatsSection } from "@/app/_components/about-page/stats";
import { StorySection } from "@/app/_components/about-page/story";
import { ValuesSection } from "@/app/_components/about-page/values";
import { CtaSection } from "@/app/_components/about-page/cta";
import { Footer } from "@/app/_components/home-page/footer";

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <HeroSection />
      <StatsSection />
      <StorySection />
      <ValuesSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
