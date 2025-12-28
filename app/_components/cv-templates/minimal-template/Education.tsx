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
      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{edu.institution}</p>
                    <h3 className="font-semibold text-sm">( {edu.degree} )</h3>
                  </div>
                  <p className="text-sm font-bold tracking-tighter text-black">
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.description && (
                  <ul className="mt-1 list-disc list-outside text-sm text-black pl-3.5">
                    {edu.description.split("\n").map((line, idx) => (
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

export default Education;
