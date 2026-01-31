"use client";

import { useEffect, useState } from "react";
import { ProfessionalTemplate } from "@/app/_components/cv-templates/professional-template";
import { ModernTemplate } from "@/app/_components/cv-templates/modern-template";
import { MinimalTemplate } from "@/app/_components/cv-templates/minimal-template";
import type { CV } from "@/types/types";

export default function PDFRenderPage() {
  const [cvData, setCvData] = useState<CV | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tid");
    const dataParam = params.get("data");

    if (tid) {
      fetch(`/api/pdf-data?tid=${encodeURIComponent(tid)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load CV data");
          return res.json();
        })
        .then((decoded: CV) => setCvData(decoded))
        .catch((err) => {
          console.error("Failed to fetch CV data:", err);
          setError("Failed to load data");
        });
    } else if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam)) as CV;
        setCvData(decoded);
      } catch (err) {
        console.error("Failed to parse CV data:", err);
        setError("Invalid data");
      }
    } else {
      setError("No data provided");
    }
  }, []);

  if (!isClient) {
    return null;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const renderTemplate = () => {
    const templateName = cvData.template?.toLowerCase();
    switch (templateName) {
      case "modern":
        return <ModernTemplate data={cvData} />;
      case "minimal":
        return <MinimalTemplate data={cvData} />;
      case "professional":
        return <ProfessionalTemplate data={cvData} />;
      default:
        return <ProfessionalTemplate data={cvData} />;
    }
  };

  return (
    <div
      className="pdf-mode bg-white"
      style={{ minHeight: "100vh", width: "100%" }}
      data-pdf-ready="true"
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
