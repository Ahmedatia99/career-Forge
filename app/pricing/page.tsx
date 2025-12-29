"use client";

import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import HeroSection from "@/app/_components/pricing-page/hero";
import StatsSection from "@/app/_components/pricing-page/stats";
import FAQSection from "@/app/_components/pricing-page/faq";
import CTASection from "@/app/_components/pricing-page/cta";
import {DashboardHeader} from "@/app/_components/dashboard-header";
import {Footer} from "@/app/_components/home-page/footer";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <HeroSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
