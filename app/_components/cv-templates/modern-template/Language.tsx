import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Language({ data }: MinimalTemplateProps) {
  return (
    <>
      {(data.languages ?? []).length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Languages
          </h2>

          <ul className="space-y-1 text-sm text-gray-700">
            {data.languages.map((lang) => (
              <li key={lang.id}>
                {lang.name} —{" "}
                <span className="text-gray-500">{lang.proficiency}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default Language;
