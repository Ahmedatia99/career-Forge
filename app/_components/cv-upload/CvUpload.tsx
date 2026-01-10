"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadCV } from "@/services/cv.service";
import { withRetryAndToast } from "@/lib/api-helpers";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function CvUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only PDF or Word documents are allowed.";
    }
    if (file.size > MAX_SIZE) {
      return "File size must be less than 5MB.";
    }
    return "";
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploaded(false);
    setProgress(0);
    setError("");

    try {
      // Simulate progress (you can use axios onUploadProgress for real progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await withRetryAndToast(
        () => uploadCV(file),
        {
          successMessage: "CV uploaded successfully",
          errorMessage: "Failed to upload CV",
          showLoading: true,
          retryOptions: {
            maxRetries: 2,
            retryDelay: 2000,
          },
        }
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      setUploaded(true);

      // Redirect to CV builder with the uploaded CV ID
      if (response.data.success && response.data.data) {
        const cvId = response.data.data.id;
        setTimeout(() => {
          router.push(`/cv-builder/${cvId}`);
        }, 1000);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to upload CV";
      setError(errorMessage);
      setProgress(0);
      console.error("Error uploading CV:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setUploaded(false);
    setError("");
  };

  return (
    <Card className="p-6 space-y-5 max-w-lg">
      <h2 className="text-xl font-semibold">Upload your CV</h2>

      {!file && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-8 cursor-pointer hover:border-primary transition">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag & drop your CV here or click to browse
          </p>
          <input
            type="file"
            hidden
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </label>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <button onClick={reset}>
              <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>

          {!uploaded && <Progress value={progress} />}

          {uploaded && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              CV uploaded successfully
            </div>
          )}

          <Button
            className="w-full"
            disabled={!file || isUploading || uploaded}
            onClick={handleUpload}
          >
            {isUploading ? "Uploading..." : uploaded ? "Uploaded!" : "Upload CV"}
          </Button>
        </div>
      )}
    </Card>
  );
}
