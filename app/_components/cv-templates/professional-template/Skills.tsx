import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Skills({ data }: MinimalTemplateProps) {
  console.log(data.skills);
  return (
    <>
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-base font-bold uppercase tracking-wide sm:text-xl">
            Skills
          </h2>

          <div className="space-y-2 text-xs sm:space-y-1 sm:text-sm">
            {(data.skills ?? []).map((group, idx) => (
              <div
                key={group.id || `skill-group-${idx}`}
                className="text-gray-800 space-y-0.5 sm:space-y-0"
              >
                <span className="font-semibold text-sm capitalize pr-1 sm:text-lg">
                  {group.category}:
                </span>
                <span className="text-xs capitalize break-words sm:text-base">
                  {(group.skills ?? []).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Skills;
