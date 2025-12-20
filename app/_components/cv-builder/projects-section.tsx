"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { Project } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface ProjectsSectionProps {
  data: Project[]
  onChange: (data: Project[]) => void
}

export function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
      url: "",
      technologies: [],
    }
    onChange([...data, newProject])
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    onChange(data.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)))
  }

  const removeProject = (id: string) => {
    onChange(data.filter((proj) => proj.id !== id))
  }

  return (
    <div className="space-y-4">
      {data.map((project, index) => (
        <Card key={project.id}>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Project {index + 1}</h4>
              <Button variant="ghost" size="icon" onClick={() => removeProject(project.id)} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input
                  value={project.title}
                  onChange={(e) => updateProject(project.id, "title", e.target.value)}
                  placeholder="E-commerce Platform"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe the project and your role..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Project URL (Optional)</Label>
                <Input
                  value={project.url}
                  onChange={(e) => updateProject(project.id, "url", e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={project.technologies.join(", ")}
                  onChange={(e) =>
                    updateProject(
                      project.id,
                      "technologies",
                      e.target.value.split(",").map((t) => t.trim()),
                    )
                  }
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={addProject} className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  )
}
