import type { CV } from "@/lib/types";
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react";
interface MinimalTemplateProps {
  data: CV;
}

function PersonalData({ data }: MinimalTemplateProps) {
  return (
    <div className="bg-linear-to-r from-blue-900 to-blue-800 px-4 py-5 text-white sm:px-8 sm:py-8">
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-xl font-bold flex flex-col gap-1 sm:text-3xl sm:gap-2">
          <span>
            {data.personalInfo?.firstName} {data.personalInfo?.lastName}
          </span>
          {data.personalInfo?.headline && (
            <span className="text-sm font-normal text-blue-100 sm:text-base sm:text-blue-50">
              {data.personalInfo?.headline}
            </span>
          )}
        </h1>
        <div className="flex flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2 sm:text-sm">
          {data.personalInfo?.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="break-all">{data.personalInfo?.email}</span>
            </div>
          )}
          {data.personalInfo?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>{data.personalInfo?.phone}</span>
            </div>
          )}
          {data.personalInfo?.country && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>{data.personalInfo?.country}</span>
            </div>
          )}
          {(data.personalInfo?.links ?? []).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              className="capitalize flex items-center gap-1.5 text-white underline hover:text-blue-100 transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PersonalData;
