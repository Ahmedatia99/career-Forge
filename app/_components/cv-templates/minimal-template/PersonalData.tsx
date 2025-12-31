import type { CV } from "@/lib/types";

interface MinimalTemplateProps {
  data: CV;
}

function PersonalData({ data }: MinimalTemplateProps) {
  return (
    <div className="mb-5 flex flex-col items-center pb-3 text-center sm:mb-4 sm:pb-2">
      <h1 className="text-2xl font-bold flex flex-col items-center gap-1 sm:text-3xl sm:gap-2">
        <span>
          {data.personalInfo?.firstName} {data.personalInfo?.lastName}
        </span>
        {data.personalInfo?.headline && (
          <span className="text-base font-semibold text-gray-600 sm:text-xl sm:text-gray-800">
            {data.personalInfo?.headline}
          </span>
        )}
      </h1>

      <div className="mt-3 flex flex-col items-center gap-2 text-xs text-gray-800 font-medium sm:mt-1 sm:flex-row sm:flex-wrap sm:items-center sm:text-sm sm:font-bold">
        {data.personalInfo?.email && (
          <span className="break-all">{data.personalInfo?.email}</span>
        )}
        {data.personalInfo?.phone && (
          <>
            <span className="hidden sm:inline">|</span>
            <span>{data.personalInfo.phone}</span>
          </>
        )}
        {data.personalInfo?.country && (
          <>
            <span className="hidden sm:inline">|</span>
            <span>{data.personalInfo.country}</span>
          </>
        )}

        {(data.personalInfo?.links ?? []).map((link, index) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            className="flex items-center gap-1 text-blue-600 underline font-bold capitalize hover:text-blue-800 transition-colors"
          >
            {index > 0 && (
              <span className="hidden sm:inline text-black">|</span>
            )}
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default PersonalData;
