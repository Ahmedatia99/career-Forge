"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Trash2 } from "lucide-react";
import type { Skill } from "@/types/types";

interface SkillsSectionProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const [categoryName, setCategoryName] = useState("");
  const [skillText, setSkillText] = useState<Record<string, string>>({});

  // Category
  const addCategory = () => {
    const name = categoryName.trim();
    if (!name) return;

    if (data.some((c) => c.category.toLowerCase() === name.toLowerCase())) {
      return;
    }

    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
        category: name,
        skills: [],
      },
    ]);

    setCategoryName("");
  };

  const removeCategory = (categoryId: string) => {
    onChange(data.filter((c) => c.id !== categoryId));
  };

  //  Skills

  const addSkill = (categoryId: string) => {
    const text = skillText[categoryId]?.trim();
    if (!text) return;

    const updated = data.map((c) =>
      c.id === categoryId && !c.skills.includes(text)
        ? { ...c, skills: [...c.skills, text] }
        : c
    );

    onChange(updated);
    setSkillText({ ...skillText, [categoryId]: "" });
  };

  const removeSkill = (categoryId: string, skill: string) => {
    const updated = data.map((c) =>
      c.id === categoryId
        ? { ...c, skills: c.skills.filter((s: string) => s !== skill) }
        : c
    );

    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Add Category */}
      <div className="space-y-2">
        <Label>Add Skill Category</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Frontend"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button onClick={addCategory}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      {data.map((group, groupIndex) => (
        <Card key={group.id || `skill-category-${groupIndex}`}>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {group.category}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCategory(group.id)}
                aria-label={`Remove ${group.category}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {(group.skills ?? []).map((skill: string, skillIndex: number) => (
                <Badge
                  key={`${
                    group.id || `category-${groupIndex}`
                  }-${skill}-${skillIndex}`}
                  variant="secondary"
                  className="gap-1"
                >
                  {skill}
                  <button onClick={() => removeSkill(group.id, skill)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add Skill */}
            <div className="flex gap-2">
              <Input
                placeholder={`Add skill to ${group.category}`}
                value={skillText[group.id] ?? ""}
                onChange={(e) =>
                  setSkillText({
                    ...skillText,
                    [group.id]: e.target.value,
                  })
                }
                onKeyDown={(e) => e.key === "Enter" && addSkill(group.id)}
              />
              <Button variant="secondary" onClick={() => addSkill(group.id)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No skill categories added yet
        </p>
      )}
    </div>
  );
}
