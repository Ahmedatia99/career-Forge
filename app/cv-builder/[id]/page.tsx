"use client";

import { useState, useEffect, useCallback } from "react";
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
import { CVActions } from "../../_components/cv-builder/cv-actions";
import {
  ArrowLeft,
  Save,
  History,
  Cloud,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import type { CV, UserProfile } from "@/types/types";
import {
  getCVById,
  createCV,
  updateCV,
  getCVStatus,
} from "@/services/cv.service";
import { withRetryAndToast } from "@/lib/api-helpers";
import {
  saveLocalCV,
  getLocalCV,
  autoSaveCV,
  cancelAutoSave,
  hasLocalChanges,
  removeLocalCV,
} from "@/lib/cv-local-storage";
import {
  mapBackendCVToFrontend,
  hasParsedContent,
  isParsingInProgress,
} from "@/lib/cv-data-mapper";
import { toast } from "sonner";

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
    template: "Minimal",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save effect - saves to local storage on changes
  useEffect(() => {
    if (cvId && cvData && !isLoadingCV) {
      autoSaveCV(cvId, cvData, 1500); // Auto-save after 1.5 seconds of no changes
      setHasUnsavedChanges(true);
    }

    return () => cancelAutoSave();
  }, [cvData, cvId, isLoadingCV]);

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

      // Check for local changes first
      const localData = getLocalCV(cvId);

      // Try to load existing CV from API
      const response = await withRetryAndToast(() => getCVById(cvId), {
        errorMessage: "Failed to load CV",
        retryOptions: {
          maxRetries: 2,
          retryCondition: (error: any) => {
            // Don't retry on 404 (CV doesn't exist)
            return error?.response?.status !== 404;
          },
        },
      });

      if (response.data.success && response.data.data) {
        const serverCV = response.data.data;

        // Debug: Log the backend response to understand its structure
        console.log("=== Backend CV Response ===");
        console.log("Full Response:", JSON.stringify(serverCV, null, 2));
        console.log("Has content:", !!serverCV.content);
        console.log("Has parsedContent:", !!serverCV.parsedContent);
        console.log("Parsing Status:", serverCV.parsingStatus);
        console.log("========================");

        // Check if CV is still being parsed
        if (isParsingInProgress(serverCV)) {
          toast.info("CV is being parsed", {
            description: "Please wait while we extract your CV content...",
          });
          // Start polling for parsing completion
          pollForParsingCompletion(cvId);
        }

        // If we have local changes AND server has no new parsed content, use local data
        // But if server has parsed content, prefer server data (user might have re-uploaded CV)
        if (localData?.isDirty && !hasParsedContent(serverCV)) {
          setCvData(localData.cv);
          toast.info("Loaded local changes", {
            description: "You have unsaved local changes that will be used.",
          });
        } else {
          // Map backend CV data to frontend form structure
          const mappedCV = mapBackendCVToFrontend(serverCV);

          // Debug: Log the mapped CV
          console.log("=== Mapped CV ===");
          console.log("Mapped Result:", JSON.stringify(mappedCV, null, 2));
          console.log("=================");

          setCvData(mappedCV);

          // Clear local storage if we're using server data with parsed content
          if (hasParsedContent(serverCV) && localData?.isDirty) {
            // Clear dirty flag since we're using fresh server data
            saveLocalCV(cvId, mappedCV);
            toast.info("Loaded parsed CV data", {
              description:
                "Your CV has been parsed. Local changes were replaced with server data.",
            });
          } else if (hasParsedContent(serverCV)) {
            toast.success("CV loaded successfully", {
              description: "Your parsed CV content is ready for editing.",
            });
          }
        }

        setHasUnsavedChanges(localData?.isDirty ?? false);
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

  // Poll for parsing completion
  const pollForParsingCompletion = async (cvId: string) => {
    const maxAttempts = 30; // 30 attempts
    const pollInterval = 2000; // 2 seconds
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const statusResponse = await getCVStatus(cvId);
        const cvData = statusResponse.data?.data;

        if (cvData && !isParsingInProgress(cvData)) {
          // Parsing completed, reload the CV
          const mappedCV = mapBackendCVToFrontend(cvData);
          setCvData(mappedCV);
          toast.success("CV parsing completed!", {
            description:
              "Your CV content has been extracted and is ready for editing.",
          });
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          toast.warning("Parsing is taking longer than expected", {
            description: "Please refresh the page to check the status.",
          });
        }
      } catch (error) {
        console.error("Error polling CV status:", error);
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        }
      }
    };

    poll();
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save to local storage first (guaranteed to work)
      saveLocalCV(cvId, cvData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      toast.success("CV saved!", {
        description:
          "Your changes are saved. Use 'Export PDF' to generate your CV.",
      });

      // Try to update title on the server (this is what the API accepts)
      try {
        const patchData: any = {};
        if (cvData.title) patchData.title = cvData.title;

        if (Object.keys(patchData).length > 0) {
          await updateCV(cvId, patchData);
          console.log("Title synced with server");
        }
      } catch (serverErr) {
        // Server sync failed, but local save succeeded
        console.log("Server sync skipped - local changes saved");
      }
    } catch (err: any) {
      console.error("Error saving CV:", err);
      toast.error("Failed to save CV");
    } finally {
      setIsSaving(false);
    }
  };

  // Force reload CV from server, ignoring local cache
  const handleForceRefresh = async () => {
    try {
      setIsLoadingCV(true);

      // Remove local cache for this CV
      removeLocalCV(cvId);

      // Reload from server
      const response = await getCVById(cvId);

      if (response.data.success && response.data.data) {
        const serverCV = response.data.data;
        const mappedCV = mapBackendCVToFrontend(serverCV);
        setCvData(mappedCV);
        setHasUnsavedChanges(false);

        toast.success("CV reloaded from server", {
          description: "Local cache cleared and CV refreshed.",
        });
      }
    } catch (err) {
      console.error("Error refreshing CV:", err);
      toast.error("Failed to refresh CV");
    } finally {
      setIsLoadingCV(false);
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
        <div className="mb-4 flex flex-row gap-3 sm:mb-6 justify-between items-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="gap-2 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>

          <div className="flex items-center gap-2">
            {/* Auto-save indicator */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              {hasUnsavedChanges ? (
                <>
                  <CloudOff className="h-3 w-3" />
                  <span>Unsaved</span>
                </>
              ) : lastSaved ? (
                <>
                  <Cloud className="h-3 w-3 text-green-500" />
                  <span>Saved</span>
                </>
              ) : null}
            </div>

            <CVActions 
              cvId={cvId} 
              cvTitle={cvData.title} 
              cvData={cvData} 
              onCVUpdate={(updatedCV) => {
                setCvData(updatedCV);
                saveLocalCV(cvId, updatedCV);
                setHasUnsavedChanges(true);
              }}
            />
            <Button
              variant="outline"
              onClick={handleForceRefresh}
              className="gap-2"
              title="Reload CV from server (clears local cache)"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/cv-builder/${cvId}/versions`)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Versions</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 sm:w-auto"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
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
