import type { CV } from "@/lib/types";
import { formatDate } from "@/utils/formatDate";
import { Minus } from "lucide-react";
interface MinimalTemplateProps {
  data: CV;
}

function Experience({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {data.workExperience && data.workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base md:text-xl font-semibold border-b border-gray-300 pb-1 mb-3 sm:mb-2">
            Experience
          </h2>
          <div className="space-y-4 sm:space-y-3">
            {data.workExperience?.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-row gap-1 justify-between items-start">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:font-semibold">
                    <h3 className="text-sm font-semibold sm:text-base">
                      {exp.title}
                    </h3>
                    <Minus className="hidden sm:block h-4 w-4" />
                    <p className="text-xs sm:text-sm sm:text-black font-bold">
                      ({exp.company})
                    </p>
                  </div>
                  <p className="text-xs font-bold tracking-tighter text-black sm:text-sm">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <ul className="mt-1.5 list-disc list-outside text-xs text-black pl-4 space-y-0.5 sm:pl-3.5 sm:text-sm">
                    {exp.description.split("\n").map((line, idx) => (
                      <li key={idx} className="leading-normal">
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
