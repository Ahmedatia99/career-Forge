import type { CV } from "@/types/types";
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
interface ModernTemplateProps {
  data: CV;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  formatDate(data);

  return (
    <div className="mx-auto max-w-[1400px] bg-white text-gray-900 shadow-lg">
      <div className="grid grid-cols-[2.2fr_3fr] md:grid-cols-[1.6fr_3fr] max-h-screen">
        {/* Sidebar */}
        <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black  pl-2 pt-5 pr-4 text-white md:pl-3 md:pt-7 md:pr-1  max-h-screen">
          <div className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider">
              Contact
            </h2>
            <div className="space-y-4 text-sm">
              {data.personalInfo.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="wrap-break-words">
                    {data.personalInfo.phone}
                  </span>
                </div>
              )}
              {data.personalInfo.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="break-all">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.country && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="wrap-break-words">
                    {data.personalInfo.country}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills?.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
                Skills
              </h2>

              <div className="space-y-1 text-sm">
                {data.skills.map((group, idx) => (
                  <div
                    key={group.id || `skill-group-${idx}`}
                    className="text-gray-800"
                  >
                    <span className="font-semibold">{group.category}:</span>{" "}
                    {(group.skills ?? []).join(", ")}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider">
                Languages
              </h2>
              <ul className="space-y-2 text-sm">
                {data.languages.map((lang) => (
                  <li key={lang.id} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    <span className="wrap-break-words text-white">
                      {lang.name}: {lang.proficiency}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="min-w-0 p-8 md:p-3 sm:p-0 max-h-screen overflow-y-auto">
          {/* Name & Title */}
          <div className="mb-10 text-center">
            <h1 className="pt-5 mb-2 wrap-break-words text-2xl font-bold capitalize tracking-wide md:text-3xl sm:text-md">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
          </div>

          {/* Professional Summary */}
          {data.professionalSummary && (
            <section className="mb-10">
              <h2 className="mb-4 pb-3 border-b border-gray-300 text-sm font-bold uppercase tracking-wider text-gray-900">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {data.professionalSummary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.workExperience.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 pb-3 border-b border-gray-300 text-sm font-bold uppercase tracking-wider text-gray-900">
                Work Experience
              </h2>
              <div className="space-y-7">
                {data.workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="mb-2">
                      <h3 className="text-base font-bold">{exp.title}</h3>
                      <p className="text-sm font-medium italic text-gray-700">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                    </div>
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </p>

                    {exp.description && (
                      <ul className="list-disc list-inside space-y-1">
                        {exp.description.split("\n").map(
                          (line, i) =>
                            line.trim() && (
                              <li
                                key={i}
                                className="text-sm leading-relaxed text-gray-700"
                              >
                                {line.trim()}
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 pb-3 border-b border-gray-300 text-sm font-bold uppercase tracking-wider text-gray-900">
                Education
              </h2>
              <div className="space-y-6">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="mb-2">
                      <h3 className="text-base font-bold">{edu.degree}</h3>
                      <p className="text-sm font-medium italic text-gray-700">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {edu.institution}
                      {edu.location && `, ${edu.location}`}
                    </p>

                    {edu.description && (
                      <ul className="list-disc list-inside space-y-1">
                        {edu.description.split("\n").map(
                          (line, i) =>
                            line.trim() && (
                              <li
                                key={i}
                                className="mt-1 text-sm italic text-gray-700"
                              >
                                {line.trim()}
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Certifications */}
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
                        <div className="flex justify-between items-start gap-2 w-full">
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
                        {formatDate(cert.startDate)}{" "}
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
          {/* Projects */}
          {data.projects.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 pb-3 border-b border-gray-300 text-sm font-bold uppercase tracking-wider text-gray-900">
                Projects
              </h2>
              <div className="space-y-6">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold">
                        {project.title}
                      </h3>
                      {project.url && (
                        <a
                          href={project.url}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:underline"
                        >
                          <LinkIcon className="h-3 w-3" />
                          Link
                        </a>
                      )}
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {project.description.split("\n").map(
                        (line, i) =>
                          line.trim() && (
                            <li
                              key={i}
                              className="text-sm leading-relaxed text-gray-700"
                            >
                              {line.trim()}
                            </li>
                          )
                      )}
                    </ul>
                    {project.technologies.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        {project.technologies.join(" • ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
