"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "../../_components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PersonalInfoSection } from "../../_components/cv-builder/personal-info-section";
import { ProfessionalSummarySection } from "../../_components/cv-builder/professional-summary-section";
import { WorkExperienceSection } from "../../_components/cv-builder/work-experience-section";
import { EducationSection } from "../../_components/cv-builder/education-section";
import { SkillsSection } from "../../_components/cv-builder/skills-section";
import { ProjectsSection } from "../../_components/cv-builder/projects-section";
import { LanguagesSection } from "../../_components/cv-builder/languages-section";
import { CertificationSection } from "../../_components/cv-builder/certification-section";
import { CVPreview } from "../../_components/cv-preview";
import { ArrowLeft, Save } from "lucide-react";
import type { CV, UserProfile } from "@/lib/types";

export default function CVBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const cvId = params.id as string;

  const [cvData, setCvData] = useState<CV>({
    id: cvId,
    title: "Untitled CV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personalInfo: {
      firstName: "",
      lastName: "",
      headline: "",
      email: "",
      phone: "",
      country: "",
      links: [],
    },
    professionalSummary: "",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: [],
    template: "minimal",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    // Load existing CV or initialize with profile data
    const storedCvs = localStorage.getItem("cvs");
    const cvs: CV[] = storedCvs ? JSON.parse(storedCvs) : [];
    const existingCv = cvs.find((cv) => cv.id === cvId);

    if (existingCv) {
      setCvData(existingCv);
    } else {
      // Initialize with user profile data
      const storedProfile = localStorage.getItem("user_profile");
      if (storedProfile) {
        const profile: UserProfile = JSON.parse(storedProfile);
        setCvData((prev: CV) => ({
          ...prev,
          personalInfo: profile,
        }));
      } else if (user) {
        setCvData((prev: CV) => ({
          ...prev,
          personalInfo: {
            firstName: user.firstName,
            lastName: user.lastName,
            headline: prev.personalInfo?.headline ?? "",
            email: user.email,
            phone: prev.personalInfo?.phone ?? "",
            country: prev.personalInfo?.country ?? "",
            links: prev.personalInfo?.links ?? [],
          },
        }));
      }
    }
  }, [user, isLoading, router, cvId]);

  const handleSave = () => {
    setIsSaving(true);

    // Update timestamp
    const updatedCv = {
      ...cvData,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const storedCvs = localStorage.getItem("cvs");
    const cvs: CV[] = storedCvs ? JSON.parse(storedCvs) : [];
    const existingIndex = cvs.findIndex((cv) => cv.id === cvId);

    if (existingIndex >= 0) {
      cvs[existingIndex] = updatedCv;
    } else {
      cvs.push(updatedCv);
    }

    localStorage.setItem("cvs", JSON.stringify(cvs));
    setCvData(updatedCv);

    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-4 flex flex-row gap-3 sm:mb-6 justify-between ">
          <Button
            onClick={() => router.push("/dashboard")}
            className="gap-2 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2  sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save CV"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Form Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cvTitle" className="text-base">
                CV Title
              </Label>
              <Input
                id="cvTitle"
                value={cvData.title}
                onChange={(e) =>
                  setCvData({ ...cvData, title: e.target.value })
                }
                placeholder="e.g., Software Engineer Resume"
                className="text-base font-medium sm:text-lg border border-accent"
              />
            </div>

            <Accordion
              type="multiple"
              defaultValue={["personal", "summary"]}
              className="space-y-3 sm:space-y-4"
            >
              <AccordionItem
                value="personal"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-lg font-semibold">
                    Personal Information
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-4">
                  <PersonalInfoSection
                    data={cvData.personalInfo}
                    onChange={(data) =>
                      setCvData({ ...cvData, personalInfo: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="summary"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Professional Summary
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <ProfessionalSummarySection
                    data={cvData.professionalSummary ?? ""}
                    onChange={(data) =>
                      setCvData({ ...cvData, professionalSummary: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="experience"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Work Experience
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <WorkExperienceSection
                    data={cvData.workExperience ?? []}
                    onChange={(data) =>
                      setCvData({ ...cvData, workExperience: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="education"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Education
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <EducationSection
                    data={cvData.education ?? []}
                    onChange={(data) =>
                      setCvData({ ...cvData, education: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="skills"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Skills
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <SkillsSection
                    data={cvData.skills ?? []}
                    onChange={(data) => setCvData({ ...cvData, skills: data })}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="projects"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Projects
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <ProjectsSection
                    data={cvData.projects ?? []}
                    onChange={(data) =>
                      setCvData({ ...cvData, projects: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="certification"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Certification
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <CertificationSection
                    data={cvData.certifications ?? []}
                    onChange={(data) =>
                      setCvData({ ...cvData, certifications: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="languages"
                className="rounded-lg border bg-card px-4 sm:px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-semibold sm:text-lg">
                    Languages
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-3 sm:pb-6 sm:pt-4">
                  <LanguagesSection
                    data={cvData.languages ?? []}
                    onChange={(data) =>
                      setCvData({ ...cvData, languages: data })
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="lg:sticky lg:top-8 lg:h-fit">
            <CVPreview
              data={cvData}
              onTemplateChange={(template) =>
                setCvData({ ...cvData, template })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
