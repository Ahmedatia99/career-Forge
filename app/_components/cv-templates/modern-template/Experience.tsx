import type { CV } from "@/lib/types";
import { formatDate } from "@/utils/formatDate";
import { TechText } from "../tech-text";

interface MinimalTemplateProps {
  data: CV;
}

function Experience({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {data.workExperience.length > 0 && (
        <section>
          <h2 className="mb-4 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Experience
          </h2>

          <div className="space-y-6">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{exp.title}</span>
                  <span className="text-gray-500">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                <p className="text-sm italic text-gray-600">
                  {exp.company}
                  {exp.location && `, ${exp.location}`}
                </p>

                {exp.description && (
                  <ul className="mt-2 list-disc list-outside pl-5 text-sm text-gray-700 space-y-1">
                    {exp.description
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i}>{line}</li>
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
