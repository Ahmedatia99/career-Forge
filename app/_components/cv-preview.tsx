"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import type { CV } from "@/lib/types";
import { ProfessionalTemplate } from "./cv-templates/professional-template";
import { ModernTemplate } from "./cv-templates/modern-template";
import { MinimalTemplate } from "./cv-templates/minimal-template";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CVPreviewProps {
  data: CV;
  onTemplateChange: (template: string) => void;
}

export function CVPreview({ data, onTemplateChange }: CVPreviewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isEnhance, setIsEnhance] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const cvTitle = data.title || "CV";
      const templateName = (data.template ?? "Minimal").toString();

      toast.info("Generating PDF...");

      const response = await fetch("/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData: data,
          options: {
            format: "A4",
            printBackground: true,
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
          (errBody as { message?: string }).message ?? "Failed to generate PDF"
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/pdf")) {
        throw new Error("Server did not return a PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvTitle.replace(/[^a-z0-9]/gi, "_")}-${templateName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("CV downloaded as PDF");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleEnhance = () => {
    setIsEnhance(true);
    toast.info("AI Enhancement coming soon!", {
      description: "This feature is under development.",
    });
    setTimeout(() => setIsEnhance(false), 1000);
  };

  const renderTemplate = () => {
    switch (data.template) {
      case "Modern":
        return <ModernTemplate data={data} />;
      case "Minimal":
        return <MinimalTemplate data={data} />;
      default:
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select value={data.template} onValueChange={onTemplateChange}>
            <SelectTrigger id="template">
              <SelectValue> {data.template ?? "Select a template"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Modern">Modern</SelectItem>
              <SelectItem value="Minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="gap-2 sm:mt-8"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export PDF
            </>
          )}
        </Button>
        {/* <Button
          onClick={handleEnhance}
          disabled={isEnhance}
          className="gap-2 sm:mt-8"
        >
          {isEnhance ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              AI Enhancement
            </>
          )}
        </Button> */}
      </div>

      <div className="overflow-hidden rounded-lg border shadow-xl">
        <div
          ref={previewRef}
          id="cv-preview"
          className="max-h-150 overflow-y-auto sm:max-h-200"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
