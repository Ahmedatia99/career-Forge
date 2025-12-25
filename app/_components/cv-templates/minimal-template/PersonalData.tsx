import type { CV } from "@/lib/types";

interface MinimalTemplateProps {
  data: CV;
}

function PersonalData({ data }: MinimalTemplateProps) {
  console.log(data.personalInfo.links);
  return (
    <div className="mb-4 flex flex-col items-center pb-2 font-bold">
      <h1 className="text-3xl font-bold">
        {data.personalInfo.firstName} {data.personalInfo.lastName}
      </h1>

      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-800 font-semibold">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.country && <span>{data.personalInfo.country}</span>}

        {(data.personalInfo.links ?? []).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            className="flex items-center gap-1 text-blue-600 underline font-bold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default PersonalData;
