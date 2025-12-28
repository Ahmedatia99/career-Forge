import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}

function Summery({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.professionalSummary && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-800">{data.professionalSummary}</p>
        </section>
      )}
    </>
  );
}

export default Summery;
