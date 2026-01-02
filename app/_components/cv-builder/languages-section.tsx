"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { Language } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LanguagesSectionProps {
  data: Language[]
  onChange: (data: Language[]) => void
}

export function LanguagesSection({ data, onChange }: LanguagesSectionProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      proficiency: "intermediate",
    }
    onChange([...data, newLanguage])
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onChange(data.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)))
  }

  const removeLanguage = (id: string) => {
    onChange(data.filter((lang) => lang.id !== id))
  }

  return (
    <div className="space-y-4">
      {data.map((language, index) => (
        <Card key={language.id}>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Language {index + 1}</h4>
              <Button variant="ghost" size="icon" onClick={() => removeLanguage(language.id)} className="h-8 w-8 hover:bg-red-500">
                <Trash2 className="h-4 w-4 " />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Input
                  value={language.name}
                  onChange={(e) => updateLanguage(language.id, "name", e.target.value)}
                  placeholder="Spanish"
                />
              </div>
              <div className="space-y-2">
                <Label>Proficiency</Label>
                <Select
                  value={language.proficiency}
                  onValueChange={(value) => updateLanguage(language.id, "proficiency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={addLanguage} className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Language
      </Button>
    </div>
  )
}
