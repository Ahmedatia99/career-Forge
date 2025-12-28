import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Language({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.languages.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-1">
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.languages.map((lang) => (
              <span key={lang.id} className="text-gray-800">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Language;
