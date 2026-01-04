"use client";

import { useState } from "react";
import type { CV } from "@/lib/types";
import { ProfessionalTemplate } from "./cv-templates/professional-template";
import { ModernTemplate } from "./cv-templates/modern-template";
import { MinimalTemplate } from "./cv-templates/minimal-template";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
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

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Call the API endpoint to generate PDF
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData: data,
          options: {
            format: "A4",
            margin: {
              top: "0.1in",
              right: "0.1in",
              bottom: "0.1in",
              left: "0.1in",
            },
            printBackground: true,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate PDF");
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.title || "CV"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(
        error instanceof Error
          ? `Failed to export PDF: ${error.message}`
          : "Failed to export PDF. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
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
      </div>

      <div className="overflow-hidden rounded-lg border shadow-xl">
        <div className="max-h-150 overflow-y-auto sm:max-h-200">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
