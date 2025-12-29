import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function HeroSection() {
  return (
    
      <section className="bg-white py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">
                100% Free for Job Seekers
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Premium Career Tools,
            <br />
            <span className="text-blue-600">Zero Cost.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
            Stop paying for subscriptions to get hired. CareerForge gives you
            enterprise-grade resume optimization and ATS tools completely free
            of charge.
          </p>

          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Free Forever Plan
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  Everything you need to land your dream job.
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <Button asChild className="mb-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
                 <Link href="/signup">
                  Get Started Free
                 </Link>
                </Button>

                <p className="mb-6 text-center text-xs text-gray-500">
                  No credit card required
                </p>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    What's included:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Unlimited AI Resume Scorer
                        </p>
                        <p className="text-xs text-gray-500">
                          Scan AI content and get feedback
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Keyword Gap Analysis
                        </p>
                        <p className="text-xs text-gray-500">
                          Find keywords to boost your resume
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          ATS Simulation
                        </p>
                        <p className="text-xs text-gray-500">
                          See exactly how ATS sees your resume
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Smart Bullet Point Generator
                        </p>
                        <p className="text-xs text-gray-500">
                          AI-written bullet points
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          PDF & Word Export
                        </p>
                        <p className="text-xs text-gray-500">
                          Export your resume or cover letter
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Why Free Card */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Why free?
                  </h3>
                </div>
                <p className="text-gray-600">
                  We partner with top companies looking to find great talent
                  like you. This allows us to keep the core tools completely
                  free for job seekers.
                </p>
              </div>

              {/* Privacy First Card */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Privacy First
                  </h3>
                </div>
                <p className="text-gray-600">
                  We never sell your personal data to advertisers. Your resume
                  is visible only to employers you choose to share it with.
                </p>
                <p className="mt-4 text-sm text-blue-600 font-medium">
                  Did you know? Paid resume services cost an average of
                  $100+/month. CareerForge saves you money while you land!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    
  );
}
