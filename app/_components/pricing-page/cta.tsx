import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CTASection() {
  return (
    
      <section className="px-4 sm:px-6 py-16">
        <div className="mx-auto w-full">
          <div className="rounded-3xl bg-blue-600 px-8 py-18 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to land your next role?
            </h2>
            <p className="mb-8 text-blue-100">
              Join over 500,000 job seekers using CareerForge to optimize their
              resumes and get hired faster.
            </p>
            <Button asChild className="mb-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
             <Link href="/signup">
              Start Building for Free
             </Link>

            </Button>
            <p className="text-sm text-blue-100">
              No credit card required • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>
    
  );
}
