import type { CV } from "@/lib/types";
import { formatDate } from "@/utils/formatDate";
import { Minus } from "lucide-react";
interface MinimalTemplateProps {
  data: CV;
}

function Experience({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {data.workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center font-semibold">
                    <h3>{exp.title}</h3>
                    <Minus />
                    <p className="italic">{exp.company}</p>
                  </div>
                  <p className="text-sm font-bold tracking-tighter text-black">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <ul className="mt-1 list-disc list-outside text-sm text-black pl-3.5">
                    {exp.description.split("\n").map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Experience;
