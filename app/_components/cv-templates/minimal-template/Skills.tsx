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
          <h2 className="text-sm font-semibold border-b border-gray-300 pb-1 mb-3 sm:text-base sm:mb-2">
            Skills
          </h2>

          <div className="space-y-2 text-xs sm:space-y-1 sm:text-sm">
            {(data.skills ?? []).map((group, idx) => (
              <div
                key={group.id || `skill-group-${idx}`}
                className="text-black capitalize space-y-0.5 sm:space-y-0"
              >
                <span className="font-semibold text-sm capitalize sm:text-base">
                  {group.category}:
                </span>{" "}
                <span className="break-words">
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
