import type { CV } from "@/lib/types"
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react"

interface ModernTemplateProps {
  data: CV
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return ""
    const d = new Date(date + "-01")
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="grid bg-white text-gray-900 shadow-lg lg:grid-cols-3">
      {/* Sidebar */}
      <div className="bg-gray-900 p-8 text-gray-100 lg:col-span-1">
        <h1 className="mb-1 text-2xl font-bold">
          {data.personalInfo.firstName}
          <br />
          {data.personalInfo.lastName}
        </h1>

        {/* Contact */}
        <div className="mb-8 mt-6 space-y-3 text-sm">
          {data.personalInfo.email && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="break-all">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.country && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{data.personalInfo.country}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill} className="rounded bg-gray-800 px-2 py-1 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider">Languages</h2>
            <div className="space-y-2">
              {data.languages.map((lang) => (
                <div key={lang.id}>
                  <div className="flex justify-between text-sm">
                    <span>{lang.name}</span>
                    <span className="capitalize text-gray-400">{lang.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-8 lg:col-span-2">
        {/* Professional Summary */}
        {data.professionalSummary && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">About Me</h2>
            <p className="leading-relaxed text-gray-700">{data.professionalSummary}</p>
          </section>
        )}

        {/* Work Experience */}
        {data.workExperience.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Experience</h2>
            <div className="space-y-6">
              {data.workExperience.map((exp) => (
                <div key={exp.id} className="relative border-l-2 border-gray-300 pl-6">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-gray-900" />
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold">{exp.title}</h3>
                    <span className="text-sm text-gray-600">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-600">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </p>
                  {exp.description && <p className="leading-relaxed text-gray-700">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </p>
                  {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Projects</h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold">{project.title}</h3>
                    {project.url && (
                      <a href={project.url} className="flex items-center gap-1 text-sm text-gray-600 hover:underline">
                        <LinkIcon className="h-3 w-3" />
                        Link
                      </a>
                    )}
                  </div>
                  <p className="leading-relaxed text-gray-700">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">{project.technologies.join(" • ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
