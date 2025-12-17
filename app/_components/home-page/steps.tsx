import { Badge } from "@/components/ui/badge";

export function Steps() {
  const steps = [
    {
      number: 1,
      title: "Upload or Import",
      description:
        "Drag and drop your current resume or import straight from LinkedIn.",
      showBadge: true,
    },
    {
      number: 2,
      title: "Optimize with AI",
      description:
        "Our AI suggests keywords, rewrites bullet points, and formats for ATS.",
      showBadge: false,
    },
    {
      number: 3,
      title: "Download & Apply",
      description:
        "Export as PDF or Word Doc and start applying with confidence.",
      showBadge: false,
    },
  ];

  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Create a winning CV in
            <span className="text-primary"> 3 simple steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From upload to download in under 5 minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div
            className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border mx-auto"
            style={{ left: "16.66%", right: "16.66%" }}
          />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  {step.showBadge && (
                    <Badge className="absolute -top-1 rounded-full translate-x-2 bg-primary text-primary-foreground z-20">
                      Start
                    </Badge>
                  )}
                  {/* Add border color */}
                  <div className="w-24 h-24 rounded-full bg-background shadow-xl border-5 border-[#e6effc] flex items-center justify-center relative z-10 ">
                    <span className="text-4xl font-bold text-primary">
                      {step.number}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
