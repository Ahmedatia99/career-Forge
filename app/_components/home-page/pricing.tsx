import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Sparkles, Heart } from "lucide-react";

const features = [
  "Unlimited Resumes",
  "Advanced AI Writing",
  "Cover Letter Generator",
  "ATS Keyword Scanner",
  "LinkedIn Profile Audit",
  "Priority Support",
  "All Future Updates",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-5 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Gift className="w-3 h-3 mr-1" />
            Surprise!
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Wait... There's No Pricing Page
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Because CareerForge is completely free. No hidden fees. No credit
            card required. No "premium" tier. Just powerful tools to help you
            land your dream job.
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-xl max-w-xl mx-auto">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Everything. Forever.</CardTitle>
            <div className="flex items-baseline justify-center gap-2 mt-4">
              <span className="text-5xl font-bold text-primary">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <CardDescription className="mt-2">
              Yes, you read that right. All features, no cost.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="w-full">
              Get Started — It's Free
            </Button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-red-500" />
              Built with love for job seekers everywhere
            </p>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h3 className="font-semibold mb-2">Why is it free?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            We believe everyone deserves access to tools that can change their
            career trajectory. Our mission is to democratize the job search, not
            monetize your struggles.
          </p>
        </div>
      </div>
    </section>
  );
}
