import { Card } from "@/components/ui/card";
import { Users, CheckCircle, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Job Seekers Helped",
  },
  {
    icon: CheckCircle,
    value: "99%",
    label: "ATS Compatibility",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Interview Success Rate",
  },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="flex flex-col items-center p-6 text-center"
            >
              <stat.icon className="mb-4 h-6 w-6 text-blue-500" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
