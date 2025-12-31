import React from "react";
import { formatDate } from "@/utils/formatDate";
import type { CV } from "@/lib/types";

interface MinimalTemplateProps {
  data: CV;
}

function Education({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold border-b border-gray-300 pb-1 mb-3 sm:text-base sm:mb-2">
            Education
          </h2>
          <div className="space-y-4 sm:space-y-3">
            {data.education?.map((edu) => (
              <div key={edu.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <p className="text-sm font-bold sm:text-base">
                      {edu.institution}
                    </p>
                    <h3 className="text-xs font-semibold sm:text-sm">
                      ( {edu.degree} )
                    </h3>
                  </div>
                  <p className="text-xs font-bold tracking-tighter text-black sm:text-sm">
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.description && (
                  <ul className="mt-1.5 list-disc list-outside text-xs text-black pl-4 space-y-0.5 sm:pl-3.5 sm:text-sm">
                    {edu.description.split("\n").map((line, idx) => (
                      <li key={idx} className="leading-relaxed">
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

export default Education;
