import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Skills({ data }: MinimalTemplateProps) {
  console.log(data.skills);
  return (
    <>
      {data.skills?.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
            Skills
          </h2>

          <div className="space-y-1 text-sm">
            {data.skills.map((group, idx) => (
              <div
                key={group.id || `skill-group-${idx}`}
                className="text-gray-800"
              >
                <span className="font-semibold text-lg capitalize pr-1">
                  {group.category}:
                </span>
                <span className="text-base capitalize">
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
