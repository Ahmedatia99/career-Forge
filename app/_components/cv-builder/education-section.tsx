"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import type { Education } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Math.random().toString(36).substr(2, 9),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string | boolean
  ) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
        <Card key={edu.id}>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Education {index + 1}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
                className="h-8 w-8 hover:bg-red-500"
              >
                <Trash2 className="h-4 w-4 " />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, "institution", e.target.value)
                    }
                    placeholder="University Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, "location", e.target.value)
                  }
                  placeholder="Boston, MA"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "endDate", e.target.value)
                    }
                    disabled={edu.current}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-edu-${edu.id}`}
                  checked={edu.current}
                  onCheckedChange={(checked) =>
                    updateEducation(edu.id, "current", checked === true)
                  }
                />
                <Label
                  htmlFor={`current-edu-${edu.id}`}
                  className="cursor-pointer font-normal"
                >
                  Currently enrolled
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={edu.description}
                  onChange={(e) =>
                    updateEducation(edu.id, "description", e.target.value)
                  }
                  placeholder="Relevant coursework, honors, achievements..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
}
