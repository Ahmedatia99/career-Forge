import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";
import { TechText } from "./../tech-text";
interface MinimalTemplateProps {
  data: CV;
}
function Projects({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.projects && data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold border-b border-gray-300 pb-1 mb-3 sm:text-base sm:mb-2">
            Projects
          </h2>
          <div className="space-y-4 sm:space-y-3">
            {data.projects.map((project) => (
              <div key={project.id} className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start">
                  <h3 className="text-sm font-semibold sm:text-base">
                    {project.title}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-xs text-blue-800 hover:text-blue-900 hover:underline flex items-center gap-1 self-start transition-colors sm:text-sm"
                    >
                      <LinkIcon className="h-3 w-3" /> View
                    </a>
                  )}
                </div>
                {project.description && (
                  <ul className="mt-1.5 list-disc list-outside text-xs text-black pl-4 space-y-0.5 sm:pl-3.5 sm:text-sm">
                    {project.description.split("\n").map((line, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
                {project.technologies.length > 0 && (
                  <p className="mt-1.5 text-xs text-black capitalize break-words sm:text-sm">
                    <span className="font-semibold">Technologies:</span>{" "}
                    <TechText text={project.technologies.join(", ")} />
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
