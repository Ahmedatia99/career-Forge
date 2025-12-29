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
    <div className="mx-auto max-w-[1100px] bg-white text-gray-900 shadow-lg">
      {/* Header */}
      <header className="border-b px-8 py-3 text-center">
        <h1 className="text-3xl font-bold capitalize flex flex-col">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
          <span className="text-lg">{data.personalInfo.headline}</span>
        </h1>
      </header>

      {/* Body */}
      <div className="grid grid-cols-[1fr_2.2fr] gap-3 px-4 py-6">
        {/* ========== LEFT COLUMN ========== */}
        <aside className="space-y-8 border-r">
          {/* Contact */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Contact
            </h2>

            <div className="space-y-3 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="break-all">{data.personalInfo.email}</span>
                </div>
              )}

              {data.personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}

              {data.personalInfo.country && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{data.personalInfo.country}</span>
                </div>
              )}

              {(data.personalInfo.links ?? []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {link.label}
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
        <main className="space-y-10">
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
