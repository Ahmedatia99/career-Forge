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
        <section className="mb-5 sm:mb-6">
          <h2 className="mb-3 border-b-2 border-blue-800 pb-2 text-base font-bold uppercase tracking-wide sm:text-xl">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-base font-semibold sm:text-lg">
                    {project.title}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="flex items-center gap-1 text-xs text-blue-800 hover:text-blue-900 hover:underline self-start transition-colors sm:text-sm"
                    >
                      <LinkIcon className="h-3 w-3" />
                      View
                    </a>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-700 sm:text-sm">
                  <TechText text={project.description} />
                </p>
                {project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-600 sm:text-sm">
                      Technologies:
                    </span>
                    {project.technologies.map((tech, index) => (
                      <Badge
                        key={`${tech}-${index}`}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 sm:text-xs"
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
    </>
  );
}

export default Projects;
