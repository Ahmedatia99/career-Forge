import type { CV } from "@/lib/types";
import { LinkIcon } from "lucide-react";
import { TechText } from './../tech-text';
interface MinimalTemplateProps {
  data: CV;
}
function Projects({ data }: MinimalTemplateProps) {
  return (
    <>
      {data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2">
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
                {project.description && (
                  <ul className="mt-1 list-disc list-outside text-sm text-black pl-3.5">
                    {project.description.split("\n").map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
                {project.technologies.length > 0 && (
                  <p className="mt-1 text-sm text-black capitalize">
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
