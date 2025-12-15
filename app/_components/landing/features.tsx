import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Upload, Palette, BarChart } from "lucide-react";

// make the background color of the icon same as the icon color but with less opacity
const features = [
  {
    icon: (
      <Sparkles className="w-12 h-12 text-primary bg-primary/10 rounded-full p-2" />
    ),
    title: "AI CV Generation",
    description:
      "Instantly generate professional CV sections powered by advanced AI generation.",
  },
  {
    icon: (
      <Upload className="w-12 h-12 text-primary bg-primary/10 rounded-full p-2" />
    ),
    title: "PDF Upload",
    description:
      "Upload your old CV, generate new sections, and export instantly.",
  },
  {
    icon: (
      <Palette className="w-12 h-12 text-primary bg-primary/10 rounded-full p-2" />
    ),
    title: "Smart Templates",
    description:
      "Choose from beautiful, ATS-optimized templates, designs and formats.",
  },
  {
    icon: (
      <BarChart className="w-12 h-12 text-primary bg-primary/10 rounded-full p-2" />
    ),
    title: "Performance Analytics",
    description:
      "Track your CV performance and get actionable insights for improvement.",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 px-4 bg-card/1">
      <div className="max-w-6xl mx-auto">
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
