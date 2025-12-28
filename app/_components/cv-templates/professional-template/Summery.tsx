import type { CV } from "@/lib/types";
import { TechText } from "../tech-text";
interface MinimalTemplateProps {
  data: CV;
}

function Summery({ data }: MinimalTemplateProps) {
  return (
    <>
     {data.professionalSummary && (
          <section className="mb-6">
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="leading-relaxed text-gray-700">
              <TechText text={data.professionalSummary} />
            </p>
          </section>
        )}
    </>
  );
}

export default Summery;
