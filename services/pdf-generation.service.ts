import api from "@/lib/axios";
import { extractData } from "@/lib/api-helpers";
import { getToken } from "@/lib/auth-storage";

export type PDFTemplate = "modern" | "minimal" | "professional";

export interface PDFGenerationJob {
  id: string;
  jobId?: string;
  cvId: string;
  template?: PDFTemplate;
  templateId?: string;
  outputFormat?: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  fileUrl?: string;
  outputFile?: {
    url?: string;
  };
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
  _links?: {
    download?: string;
  };
}

export interface PDFGenerationResponse {
  success: boolean;
  data: PDFGenerationJob;
  message?: string;
}

export interface GeneratePDFRequest {
  cvId: string;
  template?: PDFTemplate;
  templateId?: string;
  outputFormat?: string;
  versionId?: string;
  type?: string;
  parameters?: {
    customizations?: Record<string, any>;
  };
}

export interface TemplateOptions {
  templateId?: string;
  customization?: Record<string, any>;
}

/**
 * Start a PDF generation job
 * Templates: modern, minimal, professional
 */
export const generatePDF = (data: GeneratePDFRequest) => {
  // Map template names to template IDs that backend expects
  const templateMap: Record<string, string> = {
    'modern': 'modern',
    'minimal': 'minimal', 
    'professional': 'professional',
  };

  const templateId = data.templateId || templateMap[data.template || 'modern'] || 'modern';

  const payload: Record<string, any> = {
    cvId: data.cvId,
    outputFormat: data.outputFormat || 'pdf',
    templateId: templateId,
    type: 'from_cv',
  };

  if (data.versionId) {
    payload.versionId = data.versionId;
  }

  if (data.parameters?.customizations) {
    payload.parameters = { customizations: data.parameters.customizations };
  }

  return api.post<PDFGenerationResponse>("/v1/pdf-generations", payload);
};

/**
 * Get PDF generation job status
 */
export const getPDFGenerationStatus = async (jobId: string) => {
  const response = await api.get(`/v1/pdf-generations/${jobId}`);
  return extractData<PDFGenerationJob>(response);
};

/**
 * Download the generated PDF file
 */
export const downloadPDF = (jobId: string) => {
  return api.get(`/v1/pdf-generations/${jobId}/download`, {
    responseType: "blob",
  });
};

/**
 * Get PDF generation history
 */
export const getGenerationHistory = async (options: { 
  cvId?: string; 
  format?: string; 
  status?: string; 
  limit?: number;
} = {}) => {
  const response = await api.get('/v1/pdf-generations/history', { params: options });
  return extractData(response);
};

/**
 * Get generation job status
 */
export const getGenerationStatus = async (jobId: string) => {
  const response = await api.get(`/v1/pdf-generations/${jobId}`);
  return extractData<PDFGenerationJob>(response);
};

/**
 * Get generation stats
 */
export const getGenerationStats = async () => {
  const response = await api.get('/v1/pdf-generations/stats');
  return extractData(response);
};

/**
 * Get PDF preview
 */
export const getPreview = async (cvId: string, versionId?: string, templateOptions: { templateId?: string; primaryColor?: string } = {}) => {
  const payload: any = {
    cvId,
    templateId: templateOptions.templateId || 'modern',
  };

  if (versionId) {
    payload.versionId = versionId;
  }

  if (templateOptions.primaryColor) {
    payload.parameters = {
      customizations: { primaryColor: templateOptions.primaryColor },
    };
  }

  const response = await api.post('/v1/pdf-generations/preview', payload);
  return extractData(response);
};

/**
 * Download CV with smart caching and polling
 * Checks for existing completed generations before creating a new one
 */
export const downloadCV = async (
  cvId: string, 
  format: string = 'pdf', 
  templateOptions: TemplateOptions = {}, 
  versionId?: string
): Promise<{ success: boolean }> => {
  const { templateId = 'modern', customization } = templateOptions;
  const outputFormat = format || 'pdf';
  const finalTemplateId = templateId || 'modern';
  let result: PDFGenerationJob | null = null;

  // Step 1: Check if there's an existing completed generation
  try {
    const historyData = await getGenerationHistory({
      cvId,
      format: outputFormat,
      status: 'completed',
      limit: 10,
    });

    const existingJob = (historyData || []).find((job: PDFGenerationJob) => {
      const jobCvId = (job as any).cv?.id || job.cvId;
      const matchesCvId = jobCvId === cvId || jobCvId?.toString() === cvId?.toString();
      const matchesFormat = job.outputFormat === outputFormat;
      const matchesTemplate = job.templateId === finalTemplateId;
      const matchesVersion = !versionId || !(job as any).versionId || (job as any).versionId === versionId;

      return matchesCvId && matchesFormat && matchesTemplate && matchesVersion && job.status === 'completed';
    });

    if (existingJob && (existingJob.jobId || existingJob.id)) {
      console.log(`[CV Generation] Found existing completed generation: ${existingJob.jobId || existingJob.id}`);
      try {
        const downloadResponse = await api.get(`/v1/pdf-generations/${existingJob.jobId || existingJob.id}/download`, {
          responseType: 'blob',
        });

        const blob = new Blob([downloadResponse.data], {
          type: downloadResponse.headers['content-type'] ||
            (outputFormat === 'pdf' ? 'application/pdf' :
              outputFormat === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                'application/octet-stream'),
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `cv-${cvId}.${outputFormat}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (downloadErr) {
        console.warn('[CV Generation] Failed to download existing generation, will create new one');
      }
    }
  } catch (historyErr) {
    console.warn('[CV Generation] Failed to check generation history');
  }

  // Step 2: Create new generation job
  const payload: GeneratePDFRequest = {
    cvId,
    outputFormat,
    templateId: finalTemplateId,
    type: 'from_cv',
  };

  if (versionId) {
    payload.versionId = versionId;
  }

  if (customization) {
    payload.parameters = { customizations: customization };
  }

  const response = await generatePDF(payload);
  result = response.data.data;

  if (!result.jobId && !result.id) {
    throw new Error('Failed to start CV generation: No job ID returned');
  }

  const jobId = result.jobId || result.id;

  // Poll for completion
  let status = result.status || 'pending';
  let attempts = 0;
  const maxAttempts = 60;

  while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const statusData = await getGenerationStatus(jobId);
      status = statusData.status;

      // Check multiple indicators of completion
      if (statusData.completedAt || statusData._links?.download || statusData.outputFile?.url) {
        status = 'completed';
      }
    } catch (err) {
      console.error(`[CV Generation] Status check failed (attempt ${attempts + 1})`);
    }
    attempts++;
  }

  if (status === 'completed') {
    try {
      const downloadResponse = await api.get(`/v1/pdf-generations/${jobId}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([downloadResponse.data], {
        type: downloadResponse.headers['content-type'] ||
          (format === 'pdf' ? 'application/pdf' :
            format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
              'application/octet-stream'),
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cv-${cvId}.${format || 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (downloadErr: any) {
      // Try with fetch as fallback
      try {
        const token = getToken();
        const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/v1/pdf-generations/${jobId}/download`;
        
        const fetchResponse = await fetch(downloadUrl, {
          method: 'GET',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          redirect: 'follow',
        });

        if (fetchResponse.ok || fetchResponse.redirected) {
          if (fetchResponse.redirected) {
            window.location.href = fetchResponse.url;
          } else {
            const blob = await fetchResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `cv-${cvId}.${format || 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          }
          return { success: true };
        }
      } catch (fetchErr) {
        console.error('[CV Generation] Fetch download also failed');
      }

      throw new Error(`Failed to download CV: ${downloadErr.message}`);
    }
  }

  if (status === 'failed') {
    throw new Error('CV generation failed');
  }

  throw new Error(`CV generation timed out after ${maxAttempts * 2} seconds. Status: ${status}`);
};