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
        <section className="mb-6">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
            Work Experience
          </h2>
          <div className="space-y-2">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-1 items-center">
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    <p className="font-medium text-blue-800">({exp.company})</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <ul className="mt-2 pl-3.5 list-disc list-outside text-sm text-gray-800">
                    {exp.description.split("\n").map((line, idx) => (
                      <li key={idx} className="list-item mt-1">
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
