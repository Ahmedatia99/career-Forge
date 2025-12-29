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
          <h2 className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {data.professionalSummary}
          </p>
        </section>
      )}
    </>
  );
}

export default Summery;
