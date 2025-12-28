import type { CV } from "@/lib/types";

interface MinimalTemplateProps {
  data: CV;
}

function PersonalData({ data }: MinimalTemplateProps) {
  return (
    <div className="mb-4 flex flex-col items-center pb-2 font-bold">
      <h1 className="text-3xl font-bold flex  flex-col items-center">
        {data.personalInfo.firstName} {data.personalInfo.lastName}
        <span className="text-xl font-semibold">
          {data.personalInfo.headline}
        </span>
      </h1>

      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-800 font-bold">
        {data.personalInfo.email && (
          <span className="mr-1">{data.personalInfo.email}</span>
        )}
        {data.personalInfo.phone && (
          <span className="mx-1">| {data.personalInfo.phone} |</span>
        )}
        {data.personalInfo.country && (
          <span className="mx-1">{data.personalInfo.country}</span>
        )}

        {(data.personalInfo.links ?? []).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            className="flex items-center gap-1 text-blue-600 underline font-bold capitalize pr-1"
          >
            <span className="text-black">|</span> {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default PersonalData;
