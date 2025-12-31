"use client";

import { useEffect, useState } from "react";
import { ProfessionalTemplate } from "@/app/_components/cv-templates/professional-template";
import { ModernTemplate } from "@/app/_components/cv-templates/modern-template";
import { MinimalTemplate } from "@/app/_components/cv-templates/minimal-template";
import type { CV } from "@/types/types";

export default function PDFRenderPage() {
  const [cvData, setCvData] = useState<CV | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get data from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");

    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setCvData(decoded);
      } catch (error) {
        console.error("Failed to parse CV data:", error);
      }
    }
  }, []);

  if (!isClient || !cvData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const renderTemplate = () => {
    switch (cvData.template) {
      case "Modern":
        return <ModernTemplate data={cvData} />;
      case "Minimal":
        return <MinimalTemplate data={cvData} />;
      default:
        return <ProfessionalTemplate data={cvData} />;
    }
  };

  return (
    <div
      className="pdf-mode bg-white"
      style={{ minHeight: "100vh", width: "100%" }}
    >
      <div
        className="pdf-container"
        style={{ maxWidth: "210mm", margin: "0 auto" }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}
