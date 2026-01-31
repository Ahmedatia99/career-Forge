import React from "react";
import { formatDate } from "@/utils/formatDate";
import type { CV } from "@/lib/types";
import { TechText } from "../tech-text";
interface MinimalTemplateProps {
  data: CV;
}

function Education({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {data.education && data.education.length > 0 && (
        <section className="mb-5 sm:mb-6">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-base font-bold uppercase tracking-wide sm:text-xl">
            Education
          </h2>
          <div className="space-y-4">
            {data.education?.map((edu) => (
              <div key={edu.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1">
                    <h3 className="text-base font-semibold sm:text-lg">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-medium text-blue-800 sm:text-base">
                      ({edu.institution})
                    </p>
                  </div>
                  <div className="text-left text-xs text-gray-600 sm:text-right sm:text-sm">
                    <p>
                      {formatDate(edu.startDate)} -{" "}
                      {edu.current ? "Present" : formatDate(edu.endDate)}
                    </p>
                    {edu.location && (
                      <p className="text-xs sm:text-sm">{edu.location}</p>
                    )}
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-700 sm:text-sm">
                    <TechText text={edu.description ?? ""} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Education;
