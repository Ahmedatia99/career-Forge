"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  FileDown,
  BarChart3,
  MoreHorizontal,
  Loader2,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  startFullOptimization,
  tailorForJob,
  getOptimizationJobStatus,
  getOptimizationJobResult,
} from "@/services/optimization-job.service";
import {
  generatePDF,
  downloadPDF,
  getPDFGenerationStatus,
} from "@/services/pdf-generation.service";
import { startATSAnalysis } from "@/services/ats-analysis.service";
import { toast } from "sonner";
import type { CV } from "@/types/types";
import { getCVForExport } from "@/lib/cv-local-storage";

interface CVActionsProps {
  cvId: string;
  cvTitle: string;
  cvData?: CV; // Optional: pass current CV data for local export
  onCVUpdate?: (updatedCV: CV) => void; // Callback when CV is updated by AI
}

type PDFTemplate = "modern" | "minimal" | "professional";

export function CVActions({ cvId, cvTitle, cvData, onCVUpdate }: CVActionsProps) {
  // Optimization state
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  // PDF state
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfTemplate, setPdfTemplate] = useState<PDFTemplate>("modern");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfJobId, setPdfJobId] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<
    "idle" | "processing" | "completed" | "failed"
  >("idle");

  // ATS state
  const [atsDialogOpen, setAtsDialogOpen] = useState(false);
  const [atsJobTitle, setAtsJobTitle] = useState("");
  const [atsJobDescription, setAtsJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleOptimize = async () => {
    if (!jobDescription) {
      toast.error("Please enter a job description");
      return;
    }

    try {
      setIsOptimizing(true);
      setOptimizationProgress(0);

      // Get current CV data for optimization
      const cvForOptimization = getCVForExport(cvId, cvData);
      
      if (!cvForOptimization) {
        toast.error("No CV data found to optimize");
        setIsOptimizing(false);
        return;
      }

      toast.info("Starting AI optimization...");

      // Start the optimization job with CV data
      const response = await tailorForJob({
        cvId,
        cvData: cvForOptimization,
        jobData: {
          title: targetJobTitle || undefined,
          description: jobDescription,
        },
      });

      const jobData = response.data?.data;
      const jobId = jobData?.jobId || jobData?.id || jobData?._id;

      if (!jobId) {
        toast.error("Failed to start optimization");
        setIsOptimizing(false);
        return;
      }

      toast.success("Optimization started!", {
        description: "AI is enhancing your CV...",
      });

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60; // 60 * 2s = 120s timeout

      const pollInterval = setInterval(async () => {
        attempts++;
        setOptimizationProgress(Math.min((attempts / maxAttempts) * 100, 95));

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setIsOptimizing(false);
          setOptimizationProgress(0);
          toast.error("Optimization timed out. Please try again.");
          return;
        }

        try {
          const statusResponse = await getOptimizationJobStatus(jobId);
          const statusData = statusResponse.data?.data;

          if (statusData?.status === "completed") {
            clearInterval(pollInterval);
            setOptimizationProgress(100);

            // Get the optimization result
            try {
              const resultData = await getOptimizationJobResult(jobId);
              
              // The result should contain the optimized CV data
              const optimizedCV = resultData?.optimizedCV || resultData?.result || resultData;
              
              if (optimizedCV && onCVUpdate) {
                // Map the optimized data to our CV format
                const updatedCV: CV = {
                  ...cvData,
                  id: cvId,
                  title: cvData?.title || cvTitle,
                  personalInfo: optimizedCV.personalInfo || cvData?.personalInfo,
                  professionalSummary: optimizedCV.professionalSummary || optimizedCV.summary || cvData?.professionalSummary,
                  workExperience: optimizedCV.workExperience || optimizedCV.experience || cvData?.workExperience,
                  education: optimizedCV.education || cvData?.education,
                  skills: optimizedCV.skills || cvData?.skills,
                  projects: optimizedCV.projects || cvData?.projects,
                  languages: optimizedCV.languages || cvData?.languages,
                  certifications: optimizedCV.certifications || cvData?.certifications,
                  template: cvData?.template || "Minimal",
                  createdAt: cvData?.createdAt || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                } as CV;

                onCVUpdate(updatedCV);
                toast.success("CV optimized successfully!", {
                  description: "Your CV has been enhanced with AI suggestions.",
                });
              } else {
                toast.success("Optimization completed!", {
                  description: "Check the results in your CV.",
                });
              }
            } catch (resultErr) {
              console.error("Failed to get optimization result:", resultErr);
              toast.success("Optimization completed!", {
                description: "Refresh to see the changes.",
              });
            }

            setOptimizeDialogOpen(false);
            setJobDescription("");
            setTargetJobTitle("");
            setIsOptimizing(false);
            setOptimizationProgress(0);
            return;
          }

          if (statusData?.status === "failed") {
            clearInterval(pollInterval);
            setIsOptimizing(false);
            setOptimizationProgress(0);
            toast.error(statusData?.error || "Optimization failed");
            return;
          }

          // Update progress if available
          if (statusData?.progress) {
            setOptimizationProgress(statusData.progress);
          }
        } catch (err) {
          console.error("Error polling optimization status:", err);
        }
      }, 2000);

    } catch (err: any) {
      toast.error(err?.message || "Failed to start optimization");
      setIsOptimizing(false);
      setOptimizationProgress(0);
    }
  };

  // Export PDF using Puppeteer (Next.js API route)
  const handleExportPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfStatus("processing");

      // Get the CV data - prefer local data over server data
      const cvForExport = getCVForExport(cvId, cvData);

      if (!cvForExport) {
        toast.error("No CV data found to export");
        setPdfStatus("failed");
        setIsGeneratingPDF(false);
        return;
      }

      // Set the template on the CV data
      const cvWithTemplate = {
        ...cvForExport,
        template: pdfTemplate.charAt(0).toUpperCase() + pdfTemplate.slice(1), // Capitalize: "modern" -> "Modern"
      };

      toast.info("Generating PDF...");

      // Call our local API route that uses Puppeteer
      const response = await fetch("/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData: cvWithTemplate,
          options: {
            format: "A4",
            printBackground: true,
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(
          (errBody as { message?: string })?.message ?? "Failed to generate PDF"
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/pdf")) {
        throw new Error("Server did not return a PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvTitle || "CV"}-${pdfTemplate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setPdfStatus("completed");
      toast.success("PDF downloaded successfully!");

      // Reset after a delay
      setTimeout(() => {
        setPdfStatus("idle");
        setPdfDialogOpen(false);
      }, 2000);
    } catch (err: any) {
      console.error("Export PDF error:", err);
      setPdfStatus("failed");
      toast.error(err.message || "Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Generate PDF using backend service (server-side)
  const handleServerGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfStatus("processing");

      // Get the CV data - prefer local data over server data
      const cvForExport = getCVForExport(cvId, cvData);

      if (!cvForExport) {
        toast.error("No CV data found to export");
        setPdfStatus("failed");
        setIsGeneratingPDF(false);
        return;
      }

      toast.info("Starting PDF generation...");

      // Use the API's PDF generation with the cvId
      const response = await generatePDF({
        cvId,
        template: pdfTemplate,
      });

      // Extract the job data from response
      const responseData = response.data?.data || response.data;
      const jobId =
        responseData?.jobId || responseData?.id || responseData?._id;

      if (!jobId) {
        console.error("PDF generation response:", response.data);
        toast.error("Failed to start PDF generation");
        setPdfStatus("failed");
        setIsGeneratingPDF(false);
        return;
      }

      setPdfJobId(jobId);
      toast.success("PDF generation started!", {
        description: "Your PDF is being generated.",
      });

      // Poll for completion - check status first before downloading
      let attempts = 0;
      const maxAttempts = 60; // 60 * 2s = 120s timeout

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setPdfStatus("failed");
          setIsGeneratingPDF(false);
          toast.error("PDF generation timed out");
          return;
        }

        try {
          // Check job status first
          const statusData = await getPDFGenerationStatus(jobId);
          console.log(
            `[PDF] Poll attempt ${attempts}: status=${statusData?.status}`,
          );

          // Check if completed
          const isCompleted =
            statusData?.status === "completed" ||
            statusData?.completedAt ||
            statusData?._links?.download ||
            statusData?.outputFile?.url;

          if (isCompleted) {
            // Now try to download
            try {
              const downloadRes = await downloadPDF(jobId);
              if (downloadRes.data) {
                clearInterval(pollInterval);
                setPdfStatus("completed");

                // Create download link
                const blob = new Blob([downloadRes.data], {
                  type: "application/pdf",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${cvTitle || "CV"}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                toast.success("PDF downloaded!");
                setPdfDialogOpen(false);
                setIsGeneratingPDF(false);
              }
            } catch (downloadErr: any) {
              console.error("Download error:", downloadErr);
              clearInterval(pollInterval);
              setPdfStatus("failed");
              setIsGeneratingPDF(false);
              toast.error("Failed to download PDF");
            }
            return;
          }

          // Check if failed
          if (statusData?.status === "failed") {
            clearInterval(pollInterval);
            setPdfStatus("failed");
            setIsGeneratingPDF(false);
            toast.error(statusData?.error || "PDF generation failed");
            return;
          }

          // Still processing, continue polling
        } catch (err: any) {
          console.error(
            `[PDF] Status check error (attempt ${attempts}):`,
            err.message,
          );
          // Continue polling unless we've hit max attempts
        }
      }, 2000);
    } catch (err: any) {
      console.error("PDF generation error:", err);
      setPdfStatus("failed");
      setIsGeneratingPDF(false);
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Failed to generate PDF";
      toast.error(errorMessage);
    }
  };

  const handleATSAnalysis = async () => {
    if (!atsJobDescription) {
      toast.error("Please enter a job description");
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await startATSAnalysis({
        cvId,
        type: "compatibility",
        targetJob: {
          title: atsJobTitle || undefined,
          description: atsJobDescription,
        },
      });

      if (response.data.success) {
        toast.success("ATS Analysis started!", {
          description: "Check the ATS page for results.",
        });
        setAtsDialogOpen(false);
        setAtsJobTitle("");
        setAtsJobDescription("");
      }
    } catch (err: any) {
      toast.error("Failed to start ATS analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Optimize Button */}
      <Dialog open={optimizeDialogOpen} onOpenChange={setOptimizeDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Optimize</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI-Powered Optimization</DialogTitle>
            <DialogDescription>
              Optimize your CV for a specific job description using AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="targetTitle">Target Job Title (Optional)</Label>
              <Input
                id="targetTitle"
                placeholder="e.g., Senior Software Engineer"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDesc">Job Description</Label>
              <Textarea
                id="jobDesc"
                placeholder="Paste the job description here..."
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isOptimizing}
              />
            </div>

            {isOptimizing && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-700 dark:text-purple-300">
                      AI is optimizing your CV...
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      This may take a minute
                    </p>
                  </div>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleOptimize} disabled={isOptimizing || !jobDescription}>
              {isOptimizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isOptimizing ? "Optimizing..." : "Enhance with AI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Generation Button */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate PDF</DialogTitle>
            <DialogDescription>
              Download your CV as a PDF file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Style</Label>
              <Select
                value={pdfTemplate}
                onValueChange={(v) => setPdfTemplate(v as PDFTemplate)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {pdfStatus === "processing" && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">
                    Generating PDF...
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    This may take a moment
                  </p>
                </div>
              </div>
            )}

            {pdfStatus === "completed" && (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-700 dark:text-green-300">
                  PDF downloaded successfully!
                </p>
              </div>
            )}

            {pdfStatus === "failed" && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="font-medium text-red-700 dark:text-red-300">
                  Failed to generate PDF
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={handleExportPDF}
              disabled={isGeneratingPDF || pdfStatus === "processing"}
              className="gap-2"
            >
              {isGeneratingPDF || pdfStatus === "processing" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleServerGeneratePDF}
              disabled={isGeneratingPDF || pdfStatus === "processing"}
            >
              {isGeneratingPDF || pdfStatus === "processing" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Server Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ATS Analysis Button */}
      <Dialog open={atsDialogOpen} onOpenChange={setAtsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">ATS</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>ATS Analysis</DialogTitle>
            <DialogDescription>
              Analyze how well your CV matches a job description
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="atsTitle">Job Title</Label>
              <Input
                id="atsTitle"
                placeholder="e.g., Software Engineer"
                value={atsJobTitle}
                onChange={(e) => setAtsJobTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atsDesc">Job Description</Label>
              <Textarea
                id="atsDesc"
                placeholder="Paste the job description here..."
                rows={6}
                value={atsJobDescription}
                onChange={(e) => setAtsJobDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAtsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleATSAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
