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
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>

          <div className="space-y-1 text-sm">
            {data.skills.map((group, idx) => (
              <div
                key={group.id || `skill-group-${idx}`}
                className="text-gray-800"
              >
                <span className="font-semibold">{group.category}:</span>{" "}
                {(group.skills ?? []).join(", ")}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Skills;
