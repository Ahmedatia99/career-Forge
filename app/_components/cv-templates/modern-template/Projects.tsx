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
        <section>
          <h2 className="mb-4 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Projects
          </h2>

          <div className="space-y-5">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{project.title}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>

                <ul className="mt-2 list-disc list-outside pl-5 text-sm text-gray-700 space-y-1">
                  {project.description
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>

                {project.technologies.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
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
