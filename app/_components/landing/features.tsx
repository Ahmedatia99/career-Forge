import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, FileText, Palette, BarChart } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "AI CV Generation",
    description:
      "Instantly generate professional CV sections powered by advanced AI generation.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "PDF Upload",
    description:
      "Upload your old CV, generate new sections, and export instantly.",
  },
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "Smart Templates",
    description:
      "Choose from beautiful, ATS-optimized templates, designs and formats.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Performance Analytics",
    description:
      "Track your CV performance and get actionable insights for improvement.",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Powerful Features
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Everything you need to create a professional CV that stands out
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border border-border hover:border-primary/50 transition"
            >
              <CardHeader>
                <div className="mb-3">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
