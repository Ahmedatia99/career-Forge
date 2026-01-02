"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import type { Certification } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface CertificationSectionProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export function CertificationSection({
  data = [],
  onChange,
}: CertificationSectionProps) {
  const addCertification = () => {
    const newCertification: Certification = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      startDate: "",
      company: "",
      description: "",
      url: "",
    };
    onChange?.([...(data ?? []), newCertification]);
  };

  const updateCertification = (
    id: string,
    field: keyof Certification,
    value: string | boolean
  ) => {
    onChange?.(
      (data ?? []).map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const removeCertification = (id: string) => {
    onChange?.((data ?? []).filter((cert) => cert.id !== id));
  };

  return (
    <div className="space-y-4">
      {(data ?? []).map((cert, index) => (
        <Card key={cert.id}>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Certification {index + 1}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCertification(cert.id)}
                className="h-8 w-8 hover:bg-red-500 "
              >
                <Trash2 className="h-4 w-4 " />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Certification Title</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(cert.id, "name", e.target.value)
                    }
                    placeholder="System Design Professional Course"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Certification URL (Optional)</Label>
                  <Input
                    value={cert?.url}
                    onChange={(e) =>
                      updateCertification(cert.id, "url", e.target.value)
                    }
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={cert.company}
                    onChange={(e) =>
                      updateCertification(cert.id, "company", e.target.value)
                    }
                    placeholder="LinkedIn Learning"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={cert.startDate}
                    onChange={(e) =>
                      updateCertification(cert.id, "startDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={cert.description}
                  onChange={(e) =>
                    updateCertification(cert.id, "description", e.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addCertification}
        className="w-full bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  );
}
