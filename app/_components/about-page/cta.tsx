"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
const features = [
  "Real-time ATS Score analysis",
  "Intelligent keyword optimization",
  "Unlimited resume versions",
];

export function CtaSection() {
  const { user } = useAuth();
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden rounded-3xl bg-blue-500 p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-4 text-3xl font-bold">
                Why Choose CareerForge?
              </h2>
              <p className="mb-6 text-blue-100">
                We combine cutting-edge technology and career expertise to give
                you the unfair advantage in your job search.
              </p>
              <ul className="mb-8 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="text-accent !hover:text-white"
              >
                {!user ? (
                  <Link href="/signup">Start Your Free Trial</Link>
                ) : (
                  <Link href="/dashboard">Go to Dashboard</Link>
                )}
              </Button>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-sm p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Image
                    width={1000}
                    height={1000}
                    src="professional-man-headshot.png"
                    alt="Alex Morgan"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">Alex Morgan</p>
                    <p className="text-sm text-muted-foreground">
                      Job Offer Received
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Resume score improved by 45% with AI suggestions.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
