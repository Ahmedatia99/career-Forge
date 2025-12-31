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
      {data.workExperience && data.workExperience.length > 0 && (
        <section>
          <h2 className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:mb-4 sm:text-sm">
            Experience
          </h2>

          <div className="space-y-5 sm:space-y-6">
            {data.workExperience?.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start">
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">
                    {exp.title}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap sm:text-sm">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>

                <p className="text-xs italic text-gray-600 sm:text-sm">
                  {exp.company}
                  {exp.location && `, ${exp.location}`}
                </p>

                {exp.description && (
                  <ul className="mt-2 list-disc list-outside pl-4 text-xs text-gray-700 space-y-1 sm:pl-5 sm:text-sm">
                    {exp.description
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i} className="leading-relaxed">
                          {line}
                        </li>
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
