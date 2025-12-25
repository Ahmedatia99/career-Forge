import type { CV } from "@/lib/types";
import PersonalData from "./minimal-template/PersonalData";
import Summery from "./minimal-template/Summery";
import Experience from "./minimal-template/Experience";
import Education from "./minimal-template/Education";
import Skills from "./minimal-template/Skills";
import Projects from "./minimal-template/Projects";
import Certification from "./minimal-template/Certification";
import Language from "./minimal-template/Language";

interface MinimalTemplateProps {
  data: CV;
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  return (
    <div className="mx-auto max-w-3xl bg-white p-8 font-sans text-[15px] leading-snug text-gray-900">
      {/* Header - Personal Data */}
      <PersonalData data={data} />

      {/* Professional Summary */}
      <Summery data={data} />

      {/* Work Experience */}

      <Experience data={data} />

      {/* Education */}
      <Education data={data} />

      {/* Skills */}
      <Skills data={data} />

      {/* Projects */}
      <Projects data={data} />

      {/* Certifications */}
      <Certification data={data} />

      {/* Languages */}
      <Language data={data} />
    </div>
  );
}
