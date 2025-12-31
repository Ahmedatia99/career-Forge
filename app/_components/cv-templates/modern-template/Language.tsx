import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Language({ data }: MinimalTemplateProps) {
  return (
    <>
      {(data.languages ?? []).length > 0 && (
        <section>
          <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:mb-3 sm:text-sm">
            Languages
          </h2>

          <ul className="space-y-1 text-xs text-gray-700 sm:text-sm">
            {(data.languages ?? []).map((lang) => (
              <li key={lang.id} className="leading-relaxed">
                <span className="font-medium">{lang.name}</span> —{" "}
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
