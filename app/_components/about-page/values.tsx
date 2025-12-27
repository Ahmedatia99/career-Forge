import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, Briefcase, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Efficiency",
    description:
      "Save hours of formatting with our smart tools that handle the tedious work for you.",
  },
  {
    icon: Target,
    title: "Accuracy",
    description:
      "Beat the bots with precision keywords tailored specifically to target job descriptions.",
  },
  {
    icon: Briefcase,
    title: "Professionalism",
    description:
      "Create industry-standard templates that stand out for their clarity and impact.",
  },
  {
    icon: Lightbulb,
    title: "Empowerment",
    description:
      "Take control of your career path with data-driven insights and actionable feedback.",
  },
];

export function ValuesSection() {
  return (
    <section className="py-16 bg-muted/30 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Driven by Core Values</h2>
          <p className="text-muted-foreground">
            We build with purpose to support your career journey every step of
            the way.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <value.icon className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
