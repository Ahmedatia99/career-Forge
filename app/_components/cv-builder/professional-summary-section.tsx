"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ProfessionalSummarySectionProps {
  data: string
  onChange: (data: string) => void
}

export function ProfessionalSummarySection({ data, onChange }: ProfessionalSummarySectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="summary">Professional Summary</Label>
      <Textarea
        id="summary"
        value={data}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a brief summary of your professional background and key achievements..."
        rows={6}
        className="resize-none"
      />
      <p className="text-sm text-muted-foreground">
        A concise overview of your experience, skills, and career objectives
      </p>
    </div>
  )
}
