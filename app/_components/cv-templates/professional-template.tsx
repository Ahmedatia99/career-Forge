import type { CV } from "@/types/types";
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TechText } from "./tech-text";
// import { parseSkills } from "@/lib/skills-utils";

interface ProfessionalTemplateProps {
  data: CV;
}

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "-01");
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Parse skills to handle comma-separated values
  // const parsedSkills = parseSkills(data.skills);

  return (
    <div className="bg-white text-gray-900 shadow-lg">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 px-8 py-10 text-white">
        <h1 className="mb-2 text-3xl font-bold">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
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

      <div className="p-8">
        {/* Professional Summary - with tech word bolding */}
        {data.professionalSummary && (
          <section className="mb-6">
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="leading-relaxed text-gray-700">
              <TechText text={data.professionalSummary} />
            </p>
          </section>
        )}

        {/* Work Experience - with tech word bolding */}
        {data.workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="font-medium text-blue-800">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="mt-2 leading-relaxed text-gray-700">
                      <TechText text={exp.description} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education - with tech word bolding */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="font-medium text-blue-800">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                      {edu.location && <p>{edu.location}</p>}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="mt-2 leading-relaxed text-gray-700">
                      <TechText text={edu.description} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills - displayed as badges with comma separation support */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <Badge
                  key={`${skill}-${index}`}
                  variant="secondary"
                  className="bg-blue-100 text-blue-900 hover:bg-blue-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Projects - with tech word bolding */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        className="flex items-center gap-1 text-sm text-blue-800 hover:underline"
                      >
                        <LinkIcon className="h-3 w-3" />
                        View
                      </a>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed text-gray-700">
                    <TechText text={project.description} />
                  </p>
                  {project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-sm font-medium text-gray-600">
                        Technologies:
                      </span>
                      {project.technologies.map((tech, index) => (
                        <Badge
                          key={`${tech}-${index}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section>
            <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-xl font-bold uppercase tracking-wide">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="font-medium">{lang.name}</span>
                  <span className="capitalize text-gray-600">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
