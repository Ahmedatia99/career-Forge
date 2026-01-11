import type { CV } from "@/types/types";
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import Language from "./modern-template/Language";
import Summery from "./modern-template/Summery";
import Skills from "./modern-template/Skills";
import Experience from "./modern-template/Experience";
import Projects from "./modern-template/Projects";
import Education from "./modern-template/Education";
import Certification from "./modern-template/Certification";

interface TwoColumnTemplateProps {
  data: CV;
}

export function ModernTemplate({ data }: TwoColumnTemplateProps) {
  return (
    <div className="mx-auto max-w-275 bg-white text-gray-900 shadow-lg">
      {/* Header */}
      <header className="border-b px-4 py-4 text-center sm:px-8 sm:py-5">
        <h1 className="text-xl font-bold capitalize flex flex-col gap-1 sm:text-3xl sm:gap-2">
          <span>
            {data.personalInfo?.profileSetting?.firstName} {data.personalInfo?.profileSetting?.lastName}
          </span>
          {data.personalInfo?.headline && (
            <span className="text-sm font-normal text-gray-600 sm:text-lg sm:text-gray-700">
              {data.personalInfo.headline}
            </span>
          )}
        </h1>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-[1fr_2.2fr] sm:gap-3 sm:px-4 pdf-mode:grid-cols-[1fr_2.2fr]">
        {/* ========== LEFT COLUMN ========== */}
        <aside className="space-y-6 border-b pb-6 sm:space-y-8 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 pdf-mode:border-b-0 pdf-mode:border-r pdf-mode:pb-0 pdf-mode:pr-4">
          {/* Contact */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Contact
            </h2>

            <div className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
              {data.personalInfo?.profileSetting?.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-500 sm:h-4 sm:w-4" />
                  <span className="break-all leading-relaxed">
                    {data.personalInfo.profileSetting.email}
                  </span>
                </div>
              )}

              {data.personalInfo?.profileSetting?.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-500 sm:h-4 sm:w-4" />
                  <span className="leading-relaxed">
                    {data.personalInfo.profileSetting.phone}
                  </span>
                </div>
              )}

              {data.personalInfo?.profileSetting?.country && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-500 sm:h-4 sm:w-4" />
                  <span className="leading-relaxed">
                    {data.personalInfo.profileSetting.country}
                  </span>
                </div>
              )}

              {(data.personalInfo?.links ?? []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 hover:underline transition-colors sm:text-sm"
                >
                  <LinkIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  <span className="truncate">{link.label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Skills */}
          <Skills data={data} />

          {/* Languages */}
          <Language data={data} />
        </aside>

        {/* ========== RIGHT COLUMN ========== */}
        <main className="space-y-6 sm:space-y-10 sm:pl-4 pdf-mode:pl-4">
          {/* Summary */}
          <Summery data={data} />

          {/* Experience */}
          <Experience data={data} />

          {/* Projects */}
          <Projects data={data} />
          {/* Education */}
          <Education data={data} />

          {/* Certifications */}
          <Certification data={data} />
        </main>
      </div>
    </div>
  );
}
