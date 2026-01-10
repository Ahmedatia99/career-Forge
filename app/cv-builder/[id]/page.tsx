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
import type { CV, UserProfile } from "@/types/types";
import { getCVById, createCV, updateCV } from "@/services/cv.service";
import { withRetryAndToast } from "@/lib/api-helpers";

export default function CVBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const cvId = params.id as string;

  const [cvData, setCvData] = useState<CV>({
    id: cvId,
    title: "Untitled CV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personalInfo: {
      profileSetting: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
      },
      headline: "",
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
  const [isLoadingCV, setIsLoadingCV] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user) {
      loadCV();
    }
  }, [user, loading, router, cvId]);

  const loadCV = async () => {
    try {
      setIsLoadingCV(true);
      // Try to load existing CV from API
      const response = await withRetryAndToast(
        () => getCVById(cvId),
        {
          errorMessage: "Failed to load CV",
          retryOptions: {
            maxRetries: 2,
            retryCondition: (error: any) => {
              // Don't retry on 404 (CV doesn't exist)
              return error?.response?.status !== 404;
            },
          },
        }
      );
      if (response.data.success && response.data.data) {
        setCvData(response.data.data);
      }
    } catch (err: any) {
      // CV doesn't exist (404) or other error
      if (err?.response?.status === 404) {
        // Initialize with user profile data for new CV
        if (user) {
          setCvData((prev: CV) => ({
            ...prev,
            personalInfo: {
              profileSetting: {
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                email: user.email,
                phone: prev.personalInfo?.profileSetting?.phone ?? "",
                country: prev.personalInfo?.profileSetting?.country ?? "",
              },
              headline: prev.personalInfo?.headline ?? "",
              links: prev.personalInfo?.links ?? [],
            },
          }));
        }
      } else {
        console.error("Error loading CV:", err);
      }
    } finally {
      setIsLoadingCV(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    let updatedCv: any = null;

    try {
      // Fields that should NOT be sent to the API (backend-only fields)
      const fieldsToExclude = [
        'id', 'createdAt', 'updatedAt', 
        'metadata', 'settings', '_id', 'userId', 'status', 'source', 
        'tags', 'parsingStatus', 'isParsed', 'parsingProgress', '__v',
        'wordCount', 'sectionCount', 'viewCount', 'downloadCount', 
        'shareCount', 'favoriteCount', 'isPublic', 'seoKeywords',
        'theme', 'language', 'fontSize', 'pageFormat', 'margins'
      ];

      // Prepare CV data - only include fields that should be sent
      const { id, createdAt, updatedAt, ...cvDataToSend } = cvData;
      
      // Clean up data - only include valid CV fields
      const cleanedData: any = {};
      
      // List of valid CV fields that can be sent to API
      const validFields = [
        'title', 
        'template', 
        'personalInfo', 
        'professionalSummary', 
        'workExperience', 
        'education', 
        'skills', 
        'projects', 
        'languages', 
        'certifications'
      ];

      validFields.forEach((key) => {
        const value = (cvDataToSend as any)[key];
        if (value !== undefined && value !== null) {
          // Remove any backend-only fields from nested objects
          if (typeof value === 'object' && !Array.isArray(value)) {
            const cleanedValue: any = {};
            Object.keys(value).forEach((subKey) => {
              if (!fieldsToExclude.includes(subKey)) {
                const subValue = value[subKey];
                // Clean nested objects (like profileSetting)
                if (typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)) {
                  const cleanedSubValue: any = {};
                  Object.keys(subValue).forEach((nestedKey) => {
                    if (!fieldsToExclude.includes(nestedKey)) {
                      // Include all fields from profileSetting, even if empty
                      cleanedSubValue[nestedKey] = subValue[nestedKey];
                    }
                  });
                  // Always include profileSetting even if empty
                  if (subKey === 'profileSetting' || Object.keys(cleanedSubValue).length > 0) {
                    cleanedValue[subKey] = cleanedSubValue;
                  }
                } else {
                  cleanedValue[subKey] = subValue;
                }
              }
            });
            // Always include personalInfo even if empty
            if (Object.keys(cleanedValue).length > 0 || key === 'personalInfo') {
              cleanedData[key] = cleanedValue;
            }
          } else if (Array.isArray(value)) {
            // Clean arrays - remove backend-only fields from array items
            cleanedData[key] = value.map((item: any) => {
              if (typeof item === 'object' && item !== null) {
                const cleanedItem: any = {};
                Object.keys(item).forEach((itemKey) => {
                  if (!fieldsToExclude.includes(itemKey)) {
                    cleanedItem[itemKey] = item[itemKey];
                  }
                });
                return cleanedItem;
              }
              return item;
            });
          } else {
            cleanedData[key] = value;
          }
        }
      });

      updatedCv = cleanedData;

      // Log the data being sent for debugging
      console.log("Sending CV data:", JSON.stringify(updatedCv, null, 2));

      // Check if CV exists by trying to get it
      try {
        await getCVById(cvId);
        // CV exists, update it
        const response = await withRetryAndToast(
          () => updateCV(cvId, updatedCv),
          {
            successMessage: "CV saved successfully",
            errorMessage: "Failed to save CV",
            retryOptions: {
              maxRetries: 2,
            },
          }
        );
        if (response.data.success && response.data.data) {
          const savedCv = response.data.data;
          setCvData(savedCv);
          // Update URL if ID changed (shouldn't happen, but just in case)
          if (savedCv.id !== cvId) {
            router.replace(`/cv-builder/${savedCv.id}`);
          }
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // CV doesn't exist, create it
          const response = await withRetryAndToast(
            () => createCV(updatedCv),
            {
              successMessage: "CV created successfully",
              errorMessage: "Failed to create CV",
              retryOptions: {
                maxRetries: 2,
              },
            }
          );
          if (response.data.success && response.data.data) {
            const newCv = response.data.data;
            setCvData(newCv);
            // Update URL with the real ID from backend
            if (newCv.id !== cvId) {
              router.replace(`/cv-builder/${newCv.id}`);
            }
          }
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Error saving CV:", err);
      // Error is already handled by withRetryAndToast, but log details for debugging
      if (err?.response?.data) {
        console.error("API Error Details:", JSON.stringify(err.response.data, null, 2));
      }
      if (err?.response?.status === 400 && updatedCv) {
        console.error("Bad Request - Request payload:", JSON.stringify(updatedCv, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoadingCV) {
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
