import type { CV } from "@/lib/types";
import { formatDate } from "@/utils/formatDate";

interface MinimalTemplateProps {
  data: CV;
}

function Experience({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {data.workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm italic">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-800">
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
