import type { CV } from "@/lib/types";
import { Mail, Phone, MapPin, LinkIcon } from "lucide-react";
interface MinimalTemplateProps {
  data: CV;
}

function PersonalData({ data }: MinimalTemplateProps) {
  console.log(data.personalInfo.links);
  return (
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
        {(data.personalInfo.links ?? []).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            className="capitalize flex items-center gap-1 text-white underline font-bold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default PersonalData;
