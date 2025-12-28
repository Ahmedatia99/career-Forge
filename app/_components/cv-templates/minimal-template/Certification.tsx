import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Minus } from "lucide-react";
interface MinimalTemplateProps {
  data: CV;
}

function Certification({ data }: MinimalTemplateProps) {
  formatDate(data);
  return (
    <>
      {(data.certifications?.length ?? 0) > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-semibold  border-b border-gray-300 pb-1 mb-2">
            Certifications
          </h2>

          <div className="space-y-3 capitalize">
            {(data.certifications ?? []).map((cert) => (
              <div key={cert.id}>
                <div className=" flex justify-between items-center">
                  <div className="flex items-center font-bold">
                    <h3 className="">{cert.name}</h3>
                    <Minus />
                    <p>{cert.company}</p>
                    {cert?.url && (
                      <a
                        href={cert.url}
                        className="text-sm text-blue-800 hover:underline flex items-center gap-1 ml-4 font-medium"
                      >
                        <LinkIcon className="h-3 w-3" /> View
                      </a>
                    )}
                  </div>
                  <article>
                    <p className="text-sm font-semibold text-black">
                      {formatDate(cert.startDate)}
                    </p>
                  </article>
                </div>

                {cert.description && (
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-800">
                    {cert.description.split("\n").map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Certification;
