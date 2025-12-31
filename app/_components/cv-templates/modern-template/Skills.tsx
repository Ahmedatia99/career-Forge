import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Skills({ data }: MinimalTemplateProps) {
  console.log(data.skills);
  return (
    <>
      {data.skills && data.skills.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:mb-3 sm:text-sm">
            Skills
          </h2>

          <div className="space-y-2 text-xs sm:text-sm">
            {(data.skills ?? []).map((group) => (
              <div key={group.id} className="space-y-0.5">
                <span className="font-medium text-gray-900">
                  {group.category}
                </span>
                <p className="text-gray-600 leading-relaxed break-words">
                  {(group.skills ?? []).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Skills;
