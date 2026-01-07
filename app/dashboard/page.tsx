"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "../_components/dashboard-header";
import { CVCard } from "../_components/cv-card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import type { CV } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Load CVs from localStorage
    const storedCvs = localStorage.getItem("cvs");
    if (storedCvs) {
      setCvs(JSON.parse(storedCvs));
    }
  }, [user, loading, router]);

  const handleCreateCV = () => {
    // Generate a new CV ID
    const newCvId = Math.random().toString(36).substr(2, 9);
    router.push(`/cv-builder/${newCvId}`);
  };

  const handleDeleteCV = (id: string) => {
    const updatedCvs = cvs.filter((cv) => cv.id !== id);
    setCvs(updatedCvs);
    localStorage.setItem("cvs", JSON.stringify(updatedCvs));
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
          <Button onClick={handleCreateCV} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create CV
          </Button>
        </div>

        {cvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No CVs yet</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Get started by creating your first professional CV
            </p>
            <Button onClick={handleCreateCV} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First CV
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
