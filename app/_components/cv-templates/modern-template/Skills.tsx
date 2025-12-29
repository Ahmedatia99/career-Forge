import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Skills({ data }: MinimalTemplateProps) {
  console.log(data.skills);
  return (
    <>
      {data.skills?.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Skills
          </h2>

          <div className="space-y-2 text-sm">
            {data.skills.map((group) => (
              <div key={group.id}>
                <span className="font-medium">{group.category}</span>
                <p className="text-gray-600">
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
