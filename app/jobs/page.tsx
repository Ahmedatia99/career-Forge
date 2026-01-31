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
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  FileText,
  Sparkles,
  BarChart3,
  FileDown,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  listJobs,
  getJobStats,
  cancelJob,
  retryJob,
} from "@/services/job.service";
import type { Job, JobType, JobStatus } from "@/services/job.service";
import { toast } from "sonner";

const jobTypeIcons: Record<JobType, React.ElementType> = {
  parsing: FileText,
  optimization: Sparkles,
  "ats-analysis": BarChart3,
  "pdf-generation": FileDown,
};

const jobTypeLabels: Record<JobType, string> = {
  parsing: "CV Parsing",
  optimization: "AI Optimization",
  "ats-analysis": "ATS Analysis",
  "pdf-generation": "PDF Generation",
};

const statusColors: Record<JobStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const statusIcons: Record<JobStatus, React.ElementType> = {
  pending: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  cancelled: AlertCircle,
};

export default function JobsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      const [jobsRes, statsRes] = await Promise.all([
        listJobs(),
        getJobStats(),
      ]);

      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error("Failed to load jobs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success("Jobs refreshed");
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelJob(jobId);
      toast.success("Job cancelled");
      loadData();
    } catch (err) {
      toast.error("Failed to cancel job");
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      await retryJob(jobId);
      toast.success("Job retried");
      loadData();
    } catch (err) {
      toast.error("Failed to retry job");
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Background Jobs</h1>
            <p className="text-muted-foreground">
              Monitor and manage your processing tasks
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-5 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Jobs</CardDescription>
                <CardTitle className="text-2xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">
                  {stats.pending}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Processing</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {stats.processing}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {stats.completed}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Failed</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {stats.failed}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No jobs yet</h2>
              <p className="text-muted-foreground">
                Your background processing tasks will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const Icon = jobTypeIcons[job.type] || FileText;
              const StatusIcon = statusIcons[job.status];

              return (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {jobTypeLabels[job.type]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {job.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge className={statusColors[job.status]}>
                          <StatusIcon
                            className={`mr-1 h-3 w-3 ${job.status === "processing" ? "animate-spin" : ""}`}
                          />
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </Badge>

                        {job.status === "processing" &&
                          job.progress !== undefined && (
                            <div className="w-32">
                              <Progress value={job.progress} className="h-2" />
                            </div>
                          )}

                        <div className="flex gap-2">
                          {(job.status === "pending" ||
                            job.status === "processing") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelJob(job.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {job.status === "failed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetryJob(job.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {job.error && (
                      <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
                        {job.error}
                      </div>
                    )}

                    <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                      <span>
                        Created: {new Date(job.createdAt).toLocaleString()}
                      </span>
                      {job.completedAt && (
                        <span>
                          Completed:{" "}
                          {new Date(job.completedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
