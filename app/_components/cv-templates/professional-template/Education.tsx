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
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1">
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="font-medium text-blue-800">
                      ({edu.institution})
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDate(edu.startDate)} -{" "}
                      {edu.current ? "Present" : formatDate(edu.endDate)}
                    </p>
                    {edu.location && <p>{edu.location}</p>}
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-2 leading-relaxed text-gray-700">
                    <TechText text={edu.description} />
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
