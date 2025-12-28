import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
interface MinimalTemplateProps {
  data: CV;
}

function Certification({ data }: MinimalTemplateProps) {
    formatDate(data);
  return (
    <>
      {(data.certifications?.length ?? 0) > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Certifications
          </h2>

          <div className="space-y-3">
            {(data.certifications ?? []).map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold">{cert.name}</h3>
                      {cert?.url && (
                        <a
                          href={cert.url}
                          className="text-sm text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" /> View
                        </a>
                      )}
                    </div>

                    <p className="text-sm italic">{cert.company}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(cert.startDate)}
                  </p>
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
