import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "With basic features and conversions.",
    features: ["AI CV generation", "1 template", "PDF export", "Basic support"],
    cta: "Sign Up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/mo",
    description: "With advanced AI, templates, analytics, and more.",
    features: [
      "Advanced AI generation",
      "All templates",
      "PDF & more formats",
      "Performance analytics",
      "Priority support",
      "Unlimited exports",
    ],
    cta: "Sign Up",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your needs
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border transition relative ${
                plan.highlighted
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground z-10 px-3 py-1">
                  Recommended
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
