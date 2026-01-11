import type { CV } from "@/lib/types";

interface MinimalTemplateProps {
  data: CV;
}

function PersonalData({ data }: MinimalTemplateProps) {
  return (
    <div className="mb-5 flex flex-col items-center pb-3 text-center sm:mb-4 sm:pb-2">
      <h1 className="text-2xl font-bold flex flex-col items-center gap-1 sm:text-3xl sm:gap-2">
        <span>
          {data.personalInfo?.profileSetting?.firstName} {data.personalInfo?.profileSetting?.lastName}
        </span>
        {data.personalInfo?.headline && (
          <span className="text-base font-semibold text-black">
            {data.personalInfo?.headline}
          </span>
        )}
      </h1>

      <div className="mt-3 flex flex- flex-wrap justify-center items-center gap-2 text-xs text-black sm:mt-1 sm:text-sm font-bold">
        {data.personalInfo?.profileSetting?.email && (
          <span className="break-all">{data.personalInfo?.profileSetting?.email}</span>
        )}
        {data.personalInfo?.profileSetting?.phone && (
          <>
            <span>|</span>
            <span>{data.personalInfo.profileSetting.phone}</span>
          </>
        )}
        {data.personalInfo?.profileSetting?.country && (
          <>
            <span>|</span>
            <span>{data.personalInfo.profileSetting.country}</span>
          </>
        )}

        {(data.personalInfo?.links ?? []).map((link, index) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            className="flex items-center gap-1 text-blue-700 underline font-bold capitalize hover:text-blue-800 transition-colors"
          >
            {index > 0 && (
              <span>|</span>
            )}
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default PersonalData;
