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
      {(data.certifications ?? []).length > 0 && (
        <section>
          <h2 className="mb-4 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 ">
            Certifications
          </h2>

          <div className="space-y-4 capitalize">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between text-sm font-medium">
                  <div className=" flex">
                    <span>{cert.name}</span>
                    {cert.url && (
                      <a
                        href={cert.url}
                        className=" text-gray-600 hover:underline ml-4 items-center flex gap-1"
                      >
                        <LinkIcon className="h-3 w-3" />
                        View
                      </a>
                    )}
                  </div>

                  <span className="text-gray-500">
                    {formatDate(cert.startDate)}
                  </span>
                </div>

                {cert.company && (
                  <p className="text-sm italic text-gray-600">{cert.company}</p>
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
