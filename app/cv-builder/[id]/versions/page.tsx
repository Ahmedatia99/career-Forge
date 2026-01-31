"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "../../../_components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  History,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Clock,
} from "lucide-react";
import {
  listCVVersions,
  createCVVersion,
  activateCVVersion,
} from "@/services/cv-version.service";
import { getCVById } from "@/services/cv.service";
import type { CVVersion } from "@/services/cv-version.service";
import type { CV } from "@/types/types";
import { toast } from "sonner";

export default function CVVersionsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const cvId = params.id as string;

  const [cv, setCv] = useState<CV | null>(null);
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isActivating, setIsActivating] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [versionName, setVersionName] = useState("");
  const [versionDescription, setVersionDescription] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user && cvId) {
      loadData();
    }
  }, [user, loading, router, cvId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cvRes, versionsRes] = await Promise.all([
        getCVById(cvId),
        listCVVersions(cvId),
      ]);

      if (cvRes.data.success) {
        setCv(cvRes.data.data);
      }
      if (versionsRes.data.success) {
        setVersions(versionsRes.data.data);
      }
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    if (!versionName) {
      toast.error("Please enter a version name");
      return;
    }

    try {
      setIsCreating(true);
      const response = await createCVVersion(cvId, {
        name: versionName,
        description: versionDescription || undefined,
      });

      if (response.data.success) {
        toast.success("Version created!");
        setDialogOpen(false);
        setVersionName("");
        setVersionDescription("");
        loadData();
      }
    } catch (err) {
      toast.error("Failed to create version");
    } finally {
      setIsCreating(false);
    }
  };

  const handleActivateVersion = async (versionId: string) => {
    try {
      setIsActivating(versionId);
      const response = await activateCVVersion(cvId, versionId);

      if (response.data.success) {
        toast.success("Version activated!", {
          description: "Your CV has been restored to this version.",
        });
        loadData();
      }
    } catch (err) {
      toast.error("Failed to activate version");
    } finally {
      setIsActivating(null);
    }
  };

  if (loading || isLoading) {
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/cv-builder/${cvId}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CV
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {cv?.title || "CV"} - Versions
              </h1>
              <p className="text-muted-foreground">
                Manage snapshots and history of your CV
              </p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
                <DialogDescription>
                  Save a snapshot of your current CV state
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="versionName">Version Name</Label>
                  <Input
                    id="versionName"
                    placeholder="e.g., v1.0, Before Interview"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versionDesc">Description (Optional)</Label>
                  <Textarea
                    id="versionDesc"
                    placeholder="What changes were made..."
                    rows={3}
                    value={versionDescription}
                    onChange={(e) => setVersionDescription(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVersion} disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create Version
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Versions List */}
        {versions.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <History className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No versions yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first version to save a snapshot of your CV
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Version
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <Card key={version.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <History className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{version.name}</h3>
                          {index === 0 && (
                            <Badge variant="secondary">Latest</Badge>
                          )}
                        </div>
                        {version.description && (
                          <p className="text-sm text-muted-foreground">
                            {version.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(version.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleActivateVersion(version.id)}
                      disabled={isActivating === version.id}
                    >
                      {isActivating === version.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="mr-2 h-4 w-4" />
                      )}
                      Restore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
