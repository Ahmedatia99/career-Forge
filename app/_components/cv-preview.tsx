"use client"

import type { CV } from "@/lib/types"
import { ProfessionalTemplate } from "./cv-templates/professional-template"
import { ModernTemplate } from "./cv-templates/modern-template"
import { MinimalTemplate } from "./cv-templates/minimal-template"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CVPreviewProps {
  data: CV
  onTemplateChange: (template: string) => void
}

export function CVPreview({ data, onTemplateChange }: CVPreviewProps) {
  const handleExport = () => {
    alert("Export to PDF functionality would be implemented here using a library like jsPDF or Puppeteer")
  }

  const renderTemplate = () => {
    switch (data.template) {
      case "Modern":
        return <ModernTemplate data={data} />
      case "Minimal":
        return <MinimalTemplate data={data} />
      default:
        return <ProfessionalTemplate data={data} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select value={data.template} onValueChange={onTemplateChange}>
            <SelectTrigger id="template">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Modern">Modern</SelectItem>
              <SelectItem value="Minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExport} className="mt-8 gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border shadow-xl">
        <div className="max-h-[800px] overflow-y-auto">{renderTemplate()}</div>
      </div>
    </div>
  )
}
