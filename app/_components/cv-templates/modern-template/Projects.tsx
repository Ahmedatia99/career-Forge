import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TechText } from "../tech-text";
interface MinimalTemplateProps {
  data: CV;
}
function Projects({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:mb-4 sm:text-sm">
            Projects
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {data.projects.map((project) => (
              <div key={project.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                  <h3 className="text-xs font-semibold text-gray-900 sm:text-sm sm:font-medium">
                    {project.title}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors self-start sm:self-auto"
                    >
                      View →
                    </a>
                  )}
                </div>

                <ul className="mt-2 list-disc list-outside pl-4 text-xs text-gray-700 space-y-1 sm:pl-5 sm:text-sm">
                  {project.description
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i} className="leading-relaxed">
                        {line}
                      </li>
                    ))}
                </ul>

                {project.technologies.length > 0 && (
                  <p className="mt-1.5 text-xs text-gray-500 break-words sm:text-xs">
                    {project.technologies.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default Projects;
