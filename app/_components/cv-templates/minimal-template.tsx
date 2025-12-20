import type { CV } from "@/lib/types"
import { Mail, Phone, MapPin } from "lucide-react"

interface MinimalTemplateProps {
  data: CV
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return ""
    const d = new Date(date + "-01")
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="mx-auto max-w-3xl bg-white p-12 text-gray-900 shadow-lg">
      {/* Header */}
      <div className="mb-10 border-b border-gray-300 pb-8 text-center">
        <h1 className="mb-4 text-4xl font-light tracking-wide">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.country && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{data.personalInfo.country}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <section className="mb-8">
          <p className="text-center leading-relaxed text-gray-700">{data.professionalSummary}</p>
        </section>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-900">Experience</h2>
          <div className="space-y-6">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{exp.title}</h3>
                  <p className="mt-1 text-sm font-medium text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                {exp.description && <p className="mt-3 text-center leading-relaxed text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-900">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h3 className="text-lg font-medium">{edu.degree}</h3>
                <p className="mt-1 text-sm font-medium text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                  {edu.location && ` • ${edu.location}`}
                </p>
                {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-900">Skills</h2>
          <p className="text-center text-gray-700">{data.skills.join(" • ")}</p>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-900">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="text-center">
                <h3 className="text-lg font-medium">{project.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-700">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">{project.technologies.join(" • ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section>
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-900">Languages</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {data.languages.map((lang) => (
              <span key={lang.id} className="text-gray-700">
                {lang.name} <span className="capitalize text-gray-500">({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
