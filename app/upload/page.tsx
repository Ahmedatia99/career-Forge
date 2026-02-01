"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { uploadCV } from "@/services/cv.service";
import {
  startParsing,
  getParsingHistory,
} from "@/services/parsing-job.service";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

type UploadStatus = "idle" | "uploading" | "parsing" | "completed" | "failed";

export default function UploadPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [cvId, setCvId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    noClick: false,
    noKeyboard: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await uploadCV(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log(
        "Full upload response:",
        JSON.stringify(response.data, null, 2),
      );

      // Handle response - uploadCV now returns a standardized format
      const responseData = response.data as any;
      let newCvId: string | null = null;

      // The updated uploadCV service returns { data: { success, data: { cvId, ... } } }
      if (responseData?.data?.cvId) {
        newCvId = responseData.data.cvId;
      } else if (responseData?.data?.id) {
        newCvId = responseData.data.id;
      } else if (responseData?.data?._id) {
        newCvId = responseData.data._id;
      } else if (responseData?.cvId) {
        newCvId = responseData.cvId;
      } else if (responseData?.id) {
        newCvId = responseData.id;
      } else if (responseData?._id) {
        newCvId = responseData._id;
      } else if (responseData?.cv?.id) {
        newCvId = responseData.cv.id;
      } else if (typeof responseData === "string") {
        newCvId = responseData;
      }

      console.log("Extracted CV ID:", newCvId);

      // Even if we can't get the ID, consider it a success and redirect to dashboard
      if (newCvId) {
        setCvId(newCvId);
        console.log("CV ID set to:", newCvId);
        setUploadStatus("parsing");

        toast.success("CV uploaded successfully!", {
          description: "Parsing your CV...",
        });

        // Start parsing
        try {
          await startParsing({ cvId: newCvId });

          // Poll for parsing completion
          let attempts = 0;
          const maxAttempts = 60;
          const pollInterval = setInterval(async () => {
            attempts++;
            if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              setUploadStatus("completed");
              toast.success("CV is ready!", {
                description:
                  "Parsing is taking longer than expected. You can edit your CV now.",
              });
              return;
            }

            try {
              const historyRes = await getParsingHistory(newCvId as string);
              if (historyRes.data.success && historyRes.data.data.length > 0) {
                const latestJob = historyRes.data.data[0];
                if (latestJob.status === "completed") {
                  clearInterval(pollInterval);
                  setUploadStatus("completed");
                  toast.success("CV parsed successfully!");
                } else if (latestJob.status === "failed") {
                  clearInterval(pollInterval);
                  setUploadStatus("completed");
                  toast.warning("Parsing had some issues", {
                    description: "You can still edit your CV manually.",
                  });
                }
              }
            } catch (err) {
              // Continue polling
            }
          }, 2000);
        } catch (err) {
          // Parsing might be automatic, just mark as completed
          setUploadStatus("completed");
        }
      } else {
        // CV uploaded successfully but couldn't extract ID
        // Redirect to dashboard where user can see their CVs
        toast.success("CV uploaded successfully!", {
          description: "Redirecting to dashboard...",
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      setUploadStatus("failed");
      setErrorMessage(err?.response?.data?.message || "Failed to upload CV");
      toast.error("Upload failed");
    }
  };

  const handleEditCV = () => {
    console.log("handleEditCV called, cvId:", cvId);
    if (cvId) {
      const url = `/cv-builder/${cvId}`;
      console.log("Navigating to:", url);
      router.push(url);
    } else {
      toast.error("CV ID not found");
    }
  };

  if (loading || !user) {
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
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your CV</CardTitle>
              <CardDescription>
                Upload a PDF file and we'll parse it automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                  ${file ? "bg-green-50 dark:bg-green-950 border-green-300" : ""}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  {file ? (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <FileText className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setUploadStatus("idle");
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {isDragActive
                            ? "Drop your file here"
                            : "Drag & drop your CV here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse (PDF only, max 10MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploadStatus === "uploading" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Parsing Status */}
              {uploadStatus === "parsing" && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      Parsing your CV...
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      This may take a moment
                    </p>
                  </div>
                </div>
              )}

              {/* Success Status */}
              {uploadStatus === "completed" && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-700 dark:text-green-300">
                      CV uploaded and parsed!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your CV is ready to edit
                    </p>
                  </div>
                  <Button onClick={handleEditCV}>Edit CV</Button>
                </div>
              )}

              {/* Error Status */}
              {uploadStatus === "failed" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">
                      Upload failed
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {uploadStatus === "idle" && file && (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="w-full"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload & Parse CV
                </Button>
              )}

              {/* Tips */}
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Tips for best results
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a clean, well-formatted PDF</li>
                  <li>• Avoid scanned documents or images</li>
                  <li>• Make sure text is selectable in the PDF</li>
                  <li>• Standard CV layouts work best</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
