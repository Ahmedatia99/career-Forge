import Image from "next/image";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm text-blue-500">
            • Reinventing the Job Search
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">
            Empowering Job Seekers with{" "}
            <span className="text-blue-500">AI Precision</span>
          </h1>
          <p className="mb-10 text-muted-foreground text-pretty">
            At CareerForge, we bridge the gap between talent and opportunity.
            Our mission is to democratize the hiring process, ensuring that
            every qualified candidate gets seen by the right people, not just
            filtered by bots.
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl">
          <Image
            width={1000}
            height={1000}
            src="mission-image.png"
            alt="Team collaboration"
            className="w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="text-lg font-semibold text-white">
              Building for people, not just algorithms.
            </p>
            <p className="text-sm text-white/80">
              Our team at work, San Francisco HQ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
