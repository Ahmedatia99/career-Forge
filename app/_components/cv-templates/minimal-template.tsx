import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";

interface MinimalTemplateProps {
  data: CV;
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "-01");
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 font-serif text-[15px] leading-snug text-gray-900">
      {/* Header */}
      <div className="mb-4 border-b flex flex-col items-center border-gray-400 pb-2">
        <h1 className="text-3xl font-bold">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="mt-1 flex  flex-wrap gap-4 text-sm text-gray-800 font-semibold">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.country && (
            <span>{data.personalInfo.country}</span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-800">{data.professionalSummary}</p>
        </section>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-sm italic">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-800">
                    {exp.description.split("\n").map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm italic">{edu.institution}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.description && (
                  <p className="mt-1 text-sm text-gray-800">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="text-gray-800">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-sm text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="h-3 w-3" /> View
                    </a>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-800">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Technologies:</span>{" "}
                    {project.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold uppercase border-b border-gray-300 pb-1 mb-1">
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.languages.map((lang) => (
              <span key={lang.id} className="text-gray-800">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
