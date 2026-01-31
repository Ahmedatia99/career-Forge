import type { CV } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { TechText } from "./tech-text";
import PersonalData from "./professional-template/PersonalData";
import Summery from "./professional-template/Summery";
import Experience from "./professional-template/Experience";
import Education from "./professional-template/Education";
import Skills from "./professional-template/Skills";
import Projects from "./professional-template/Projects";
import Language from "./professional-template/Language";
import Certification from "./professional-template/Certification";
interface ProfessionalTemplateProps {
  data: CV;
}

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  return (
    <div className="bg-white text-gray-900 shadow-lg">
      {/* Header */}
      <PersonalData data={data} />

      <div className="p-4 space-y-5 sm:p-8 sm:space-y-6">
        {/* Professional Summary - with tech word bolding */}
        <Summery data={data} />

        {/* Work Experience - with tech word bolding */}
        <Experience data={data} />

        {/* Education - with tech word bolding */}
        <Education data={data} />
        {/* Skills - displayed as badges with comma separation support */}
        <Skills data={data} />

        {/* Projects - with tech word bolding */}
        <Projects data={data} />

        <Certification data={data} />

        {/* Languages */}
        <Language data={data} />
      </div>
    </div>
  );
}
