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
        <section>
          <h2 className="mb-4 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Education
          </h2>

          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{edu.degree}</span>
                  <span className="text-gray-500">
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>

                <p className="text-sm italic text-gray-600">
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
