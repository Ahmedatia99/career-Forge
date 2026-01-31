"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "../_components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Target,
  FileText,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  startATSAnalysis,
  getATSAnalysisHistory,
  getATSStats,
  getATSTrends,
  getRecentScores,
  cancelATSAnalysis,
} from "@/services/ats-analysis.service";
import { getUserCVs } from "@/services/cv.service";
import type { ATSAnalysis } from "@/services/ats-analysis.service";
import type { CV } from "@/types/types";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function ATSPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [analyses, setAnalyses] = useState<ATSAnalysis[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [stats, setStats] = useState<{
    totalAnalyses: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedCvId, setSelectedCvId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [analysesRes, statsRes, cvsRes] = await Promise.all([
        getATSAnalysisHistory(),
        getATSStats(),
        getUserCVs(),
      ]);

      if (analysesRes.data.success) {
        setAnalyses(analysesRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (cvsRes.data.success) {
        setCvs(cvsRes.data.data);
      }
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedCvId || !jobTitle || !jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsCreating(true);
      const response = await startATSAnalysis({
        cvId: selectedCvId,
        targetJob: {
          title: jobTitle,
          description: jobDescription,
        },
      });

      if (response.data.success) {
        toast.success("ATS Analysis started!");
        setDialogOpen(false);
        setSelectedCvId("");
        setJobTitle("");
        setJobDescription("");
        loadData();
      }
    } catch (err) {
      toast.error("Failed to start analysis");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelAnalysis = async (jobId: string) => {
    try {
      await cancelATSAnalysis(jobId);
      toast.success("Analysis cancelled");
      loadData();
    } catch (err) {
      toast.error("Failed to cancel analysis");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">ATS Analysis</h1>
            <p className="text-muted-foreground">
              Analyze your CVs against job descriptions
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Start ATS Analysis</DialogTitle>
                <DialogDescription>
                  Analyze how well your CV matches a job description
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cv">Select CV</Label>
                  <Select value={selectedCvId} onValueChange={setSelectedCvId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a CV" />
                    </SelectTrigger>
                    <SelectContent>
                      {cvs.map((cv) => (
                        <SelectItem key={cv.id} value={cv.id}>
                          {cv.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here..."
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStartAnalysis} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Analyses</CardDescription>
                <CardTitle className="text-2xl">
                  {stats.totalAnalyses}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Score</CardDescription>
                <CardTitle
                  className={`text-2xl ${getScoreColor(stats.averageScore)}`}
                >
                  {stats.averageScore}%
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Highest Score</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  <TrendingUp className="inline h-5 w-5 mr-1" />
                  {stats.highestScore}%
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Lowest Score</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  <TrendingDown className="inline h-5 w-5 mr-1" />
                  {stats.lowestScore}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Analyses List */}
        {analyses.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No analyses yet</h2>
              <p className="text-muted-foreground mb-4">
                Start your first ATS analysis to see how your CV matches job
                descriptions
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {analysis.targetJob?.title || "ATS Analysis"}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {analysis.targetJob?.description
                            ? `${analysis.targetJob.description.substring(0, 100)}...`
                            : "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {analysis.status === "completed" &&
                        analysis.score !== undefined && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Score
                            </p>
                            <p
                              className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}
                            >
                              {analysis.score}%
                            </p>
                          </div>
                        )}

                      <Badge className={statusColors[analysis.status]}>
                        {analysis.status === "processing" && (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        )}
                        {analysis.status === "completed" && (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {analysis.status === "failed" && (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {analysis.status === "pending" && (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {analysis.status.charAt(0).toUpperCase() +
                          analysis.status.slice(1)}
                      </Badge>

                      {(analysis.status === "pending" ||
                        analysis.status === "processing") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAnalysis(analysis.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Results for completed analysis */}
                  {analysis.status === "completed" && (
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {analysis.strengths && analysis.strengths.length > 0 && (
                        <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
                          <h4 className="flex items-center gap-2 font-medium text-green-700 dark:text-green-300 mb-2">
                            <Sparkles className="h-4 w-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
                            {analysis.strengths.slice(0, 3).map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.weaknesses &&
                        analysis.weaknesses.length > 0 && (
                          <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4">
                            <h4 className="flex items-center gap-2 font-medium text-red-700 dark:text-red-300 mb-2">
                              <AlertTriangle className="h-4 w-4" />
                              Weaknesses
                            </h4>
                            <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                              {analysis.weaknesses.slice(0, 3).map((w, i) => (
                                <li key={i}>• {w}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {analysis.missingKeywords &&
                        analysis.missingKeywords.length > 0 && (
                          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-4">
                            <h4 className="flex items-center gap-2 font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                              <FileText className="h-4 w-4" />
                              Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {analysis.missingKeywords
                                .slice(0, 6)
                                .map((k, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {k}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {analysis.error && (
                    <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
                      {analysis.error}
                    </div>
                  )}

                  <div className="mt-4 text-xs text-muted-foreground">
                    Created: {new Date(analysis.createdAt).toLocaleString()}
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
