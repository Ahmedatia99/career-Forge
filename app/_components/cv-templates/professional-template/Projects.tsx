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
    </>
  );
}

export default Projects;
