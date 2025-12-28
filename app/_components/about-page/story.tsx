import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function StorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                In 2026, we noticed a disturbing trend: talented, qualified
                candidates were getting rejected not by hiring managers, but by
                algorithms. The Applicant Tracking Systems (ATS) designed to
                streamline hiring were actually creating barriers.
              </p>
              <p>
                We realized the hiring funnel was broken. Great resumes were
                being discarded simply because they lacked specific keywords or
                had &quot;complex&quot; formatting.
              </p>
              <p>
                We built CareerForge to fix this. By leveraging advanced AI to
                reverse-engineer ATS logic, we empower candidates to speak the
                language of the machines, ensuring their human potential is
                recognized.
              </p>
            </div>
            <Link
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              Read more about our journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Image
              width={1000}
              height={1000}
              src="professional-woman-laptop.png"
              alt="Team member working"
              className="rounded-xl object-cover"
            />
            <Image
              width={1000}
              height={1000}
              src="diverse-team-meeting-discussion.jpg"
              alt="Team meeting"
              className="mt-8 rounded-xl object-cover"
            />
            <Image
              width={450}
              height={450}
              src="professional-man-smiling-office.jpg"
              alt="Team member"
              className="col-span-2 rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
