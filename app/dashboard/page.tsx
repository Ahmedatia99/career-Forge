"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "../_components/dashboard-header";
import { CVCard } from "../_components/cv-card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload } from "lucide-react";
import { getUserCVs, deleteCV, createCV } from "@/services/cv.service";
import { withRetryAndToast } from "@/lib/api-helpers";
import { createListOptimisticHandler } from "@/lib/optimistic-updates";
import type { CV } from "@/types/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoadingCVs, setIsLoadingCVs] = useState(false);
  const [isCreatingCV, setIsCreatingCV] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadCVs();
    }
  }, [user, loading, router]);

  const loadCVs = async () => {
    try {
      setIsLoadingCVs(true);
      setError(null);
      const response = await withRetryAndToast(() => getUserCVs(), {
        errorMessage: "Failed to load CVs",
        retryOptions: {
          maxRetries: 2,
          retryDelay: 1000,
        },
      });
      if (response.data.success && response.data.data) {
        setCvs(response.data.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load CVs");
      console.error("Error loading CVs:", err);
    } finally {
      setIsLoadingCVs(false);
    }
  };

  const handleCreateCV = async () => {
    try {
      setIsCreatingCV(true);

      // Create CV payload matching API expectations
      const cvPayload = {
        fileName: "Untitled_CV.pdf",
        parsedData: {
          personalInfo: {
            fullName:
              user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : "New User",
            email: user?.email || "user@example.com",
            phone: "+1234567890",
            location: "City, Country",
          },
          professionalSummary: "Professional summary goes here.",
          experience: [
            {
              title: "Job Title",
              company: "Company Name",
              startDate: "2024-01",
              endDate: "Present",
            },
          ],
          education: [
            {
              degree: "Bachelor's Degree",
              school: "University Name",
              year: "2023",
            },
          ],
          skills: ["Skill 1", "Skill 2"],
        },
      };

      const response = await withRetryAndToast(() => createCV(cvPayload), {
        successMessage: "CV created successfully",
        errorMessage: "Failed to create CV",
        retryOptions: {
          maxRetries: 1,
          retryCondition: (error: any) => {
            const status = error?.response?.status;
            return !status || (status >= 500 && status < 600);
          },
        },
      });

      if (response.data.success && response.data.data) {
        const cvId = response.data.data.id;
        // Navigate to CV builder with the real ID from backend
        router.push(`/cv-builder/${cvId}`);
      }
    } catch (err: any) {
      // If API fails, redirect to CV builder with a temporary ID
      // This allows the user to still create and edit CV locally
      const tempId = `temp-${Date.now()}`;
      router.push(`/cv-builder/${tempId}`);
    } finally {
      setIsCreatingCV(false);
    }
  };

  const handleDeleteCV = async (id: string) => {
    const cvToDelete = cvs.find((cv) => cv.id === id);
    if (!cvToDelete) return;

    const optimisticHandler = createListOptimisticHandler<CV>(cvs);
    const optimisticCvs = optimisticHandler.delete(id);

    // Optimistic update
    setCvs(optimisticCvs);

    try {
      await withRetryAndToast(() => deleteCV(id), {
        successMessage: "CV deleted successfully",
        errorMessage: "Failed to delete CV",
        retryOptions: {
          maxRetries: 2,
        },
      });
    } catch (err: any) {
      // Rollback on error
      setCvs(cvs);
      console.error("Error deleting CV:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-muted-foreground">
              Create and manage your professional CVs
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/upload")}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload CV
            </Button>
            <Button
              onClick={handleCreateCV}
              size="lg"
              className="gap-2"
              disabled={isCreatingCV}
            >
              <Plus className="h-5 w-5" />
              {isCreatingCV ? "Creating..." : "Create CV"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {isLoadingCVs ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : cvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No CVs yet</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Get started by creating your first professional CV
            </p>
            <Button
              onClick={handleCreateCV}
              size="lg"
              className="gap-2"
              disabled={isCreatingCV}
            >
              <Plus className="h-5 w-5" />
              {isCreatingCV ? "Creating..." : "Create Your First CV"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <CVCard key={cv.id} cv={cv} onDelete={handleDeleteCV} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
