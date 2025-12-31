import type { CV } from "@/lib/types";
import { TechText } from "../tech-text";
interface MinimalTemplateProps {
  data: CV;
}

function Summery({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.professionalSummary && (
        <section>
          <h2 className="mb-2.5 border-b pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:mb-3 sm:text-sm">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
            {data.professionalSummary}
          </p>
        </section>
      )}
    </>
  );
}

export default Summery;
