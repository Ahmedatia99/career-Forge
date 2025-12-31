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
        <section>
          <h2 className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:mb-4 sm:text-sm">
            Education
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {data.education?.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start">
                  <span className="text-xs font-semibold text-gray-900 sm:text-sm sm:font-medium">
                    {edu.degree}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap sm:text-sm">
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>

                <p className="text-xs italic text-gray-600 sm:text-sm">
                  {edu.institution}
                  {edu.location && `, ${edu.location}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Education;
