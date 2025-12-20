import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Check, Minus } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["1 Resume Template", "Basic AI Suggestions", "No Cover Letter"],
    description: "Perfect for trying out the builder.",
    cta: "Sign Up Free",
    highlighted: false,
    Kbd: false,
  },
  {
    name: "Pro Monthly",
    price: "$15",
    period: "/mo",
    features: [
      "Unlimited Resumes",
      "Advanced AI Writing",
      "Cover Letter Generator",
      "ATS Keyword Scanner",
    ],
    description: "Everything you need to get hired.",
    cta: "Get Started",
    highlighted: true,
    Kbd: false,
  },
  {
    name: "Pro Yearly",
    price: "$9",
    period: "/mo",
    features: [
      "All Pro Monthly Features",
      "Priority Support",
      "LinkedIn Profile Audit",
    ],
    description: "",
    cta: "Select Yearly",
    highlighted: false,
    Kbd: true,
  },
];
// make the kbd green
export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Invest in your career for less than the price of a coffee
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border transition relative flex flex-col  ${
                plan.highlighted
                  ? "border-primary bg-white ring-1 ring-primary shadow-xl"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* MOST POPULAR Badge font be smaller */}
              {plan.highlighted && (
                <Badge className="absolute -top-1 left-0 w-full rounded-t-xl rounded-b-none justify-center py-1 text-xs bg-primary text-primary-foreground hover:bg-primary shadow-sm z-10">
                  MOST POPULAR
                </Badge>
              )}
              <CardHeader className={`justify-center ${plan.highlighted ? "pt-8" : "pt-6"}`}>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col">
                <CardDescription>
                  {plan.description}{" "}
                  {plan.Kbd && (
                    <Badge className="text-xs bg-green-50 text-green-600 font-semibold">
                      Billed 108$ yearly (Save 40%)
                    </Badge>
                  )}
                </CardDescription>
                <div className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      {feature.startsWith("No ") ? (
                        <Minus className="w-5 h-5 text-muted-foreground shrink-0" />
                      ) : (
                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.startsWith("No ")
                            ? "text-muted-foreground"
                            : ""
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className={
                    plan.highlighted
                      ? "w-full mt-auto "
                      : "w-full mt-auto bg-transparent border-primary text-primary"
                  }
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* view all plan details button be little further from the cards */}
        <Button
          variant="link"
          className="mt-12 w-full text-blue-600 hover:text-blue-700 font-medium "
        >
          View all plan details
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
