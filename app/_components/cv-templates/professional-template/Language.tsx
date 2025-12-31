import type { CV } from "@/lib/types";
interface MinimalTemplateProps {
  data: CV;
}
function Language({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.languages && data.languages.length > 0 && (
        <section>
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
            Languages
          </h2>
          <div className="flex flex-col items-start gap-3">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-center">
                <span className="font-medium pr-2">{lang.name}</span>
                <span className="capitalize text-gray-800">
                  ( {lang.proficiency} )
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Language;
