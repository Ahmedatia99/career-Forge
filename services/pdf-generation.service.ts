import api from "@/lib/axios";

export type PDFTemplate = "modern" | "classic" | "creative";

export interface PDFGenerationJob {
  id: string;
  cvId: string;
  template: PDFTemplate;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface PDFGenerationResponse {
  success: boolean;
  data: PDFGenerationJob;
  message?: string;
}

export interface GeneratePDFRequest {
  cvId: string;
  template: PDFTemplate;
}

/**
 * Start a PDF generation job
 * Templates: modern, classic, creative
 */
export const generatePDF = (data: GeneratePDFRequest) => {
  return api.post<PDFGenerationResponse>("/v1/pdf-generations", data);
};

/**
 * Download the generated PDF file
 */
export const downloadPDF = (jobId: string) => {
  return api.get(`/v1/pdf-generations/${jobId}/download`, {
    responseType: "blob",
  });
};
