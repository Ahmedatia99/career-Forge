import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";
interface MinimalTemplateProps {
  data: CV;
}
function Projects({ data }: MinimalTemplateProps) {
  return (
    <>
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
    </>
  );
}

export default Projects;
