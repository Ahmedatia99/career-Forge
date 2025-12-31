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
        <section className="mb-5 sm:mb-6">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-base font-bold uppercase tracking-wide sm:text-xl">
            Work Experience
          </h2>
          <div className="space-y-4 sm:space-y-2">
            {data.workExperience?.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-1 sm:items-center">
                    <h3 className="text-base font-semibold sm:text-lg">
                      {exp.title}
                    </h3>
                    <p className="text-sm font-medium text-blue-800 sm:text-base">
                      ({exp.company})
                    </p>
                  </div>
                  <div className="text-left text-xs text-gray-600 sm:text-right sm:text-sm">
                    <p>
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                    {exp.location && (
                      <p className="text-xs sm:text-sm">{exp.location}</p>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <ul className="mt-2 pl-4 list-disc list-outside text-xs text-gray-800 sm:pl-3.5 sm:text-sm">
                    {exp.description.split("\n").map((line, idx) => (
                      <li key={idx} className="list-item mt-1 leading-relaxed">
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
