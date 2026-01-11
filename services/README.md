# API Services Documentation

This directory contains all API service modules for interacting with the CareerForge Backend API v3.

## Structure

All services are organized by feature and follow a consistent pattern:

- **TypeScript interfaces** for request/response types
- **Exported functions** for each API endpoint
- **JSDoc comments** for documentation

## Services Overview

### 1. Health & System (`health.service.ts`)
Health check and system monitoring endpoints.

```typescript
import { healthCheck, detailedHealthCheck, readinessProbe, getMetrics } from "@/services/health.service";
```

**Endpoints:**
- `healthCheck()` - Basic health check
- `detailedHealthCheck()` - Detailed health with database status
- `readinessProbe()` - Service readiness check
- `getMetrics()` - Prometheus metrics

### 2. Authentication (`auth.service.ts`)
User authentication and profile management.

```typescript
import { register, login, refreshToken, logout, getCurrentUser } from "@/services/auth.service";
```

**Endpoints:**
- `register(data)` - Register new user
- `login(data)` - Authenticate user
- `refreshToken()` - Refresh access token
- `logout()` - Logout user
- `getCurrentUser()` - Get current user profile

### 3. CV Operations (`cv.service.ts`)
Core CRUD operations for CVs.

```typescript
import { 
  getUserCVs, 
  uploadCV, 
  createCV, 
  getCVById, 
  getCVStatus,
  searchCVs,
  updateCV,
  patchCV,
  duplicateCV,
  bulkOperationCVs,
  deleteCV
} from "@/services/cv.service";
```

**Endpoints:**
- `getUserCVs()` - List all user CVs
- `uploadCV(file)` - Upload CV file (PDF)
- `createCV(data)` - Create CV manually
- `getCVById(id)` - Get CV details
- `getCVStatus(id)` - Get CV parsing status
- `searchCVs(query)` - Search CVs by keywords
- `updateCV(id, data)` - Full CV update
- `patchCV(id, data)` - Partial update or state change
- `duplicateCV(id, data?)` - Duplicate CV
- `bulkOperationCVs(data)` - Bulk operations (archive/delete)
- `deleteCV(id)` - Delete CV

### 4. CV Versions (`cv-version.service.ts`)
CV version management and snapshots.

```typescript
import { 
  listCVVersions, 
  createCVVersion, 
  getCVVersion, 
  activateCVVersion 
} from "@/services/cv-version.service";
```

**Endpoints:**
- `listCVVersions(cvId)` - List all versions
- `createCVVersion(cvId, data)` - Create version snapshot
- `getCVVersion(cvId, versionId)` - Get version details
- `activateCVVersion(cvId, versionId)` - Restore version

### 5. Parsing Jobs (`parsing-job.service.ts`)
Asynchronous CV parsing job management.

```typescript
import { startParsing, getParsingHistory } from "@/services/parsing-job.service";
```

**Endpoints:**
- `startParsing(data)` - Start parsing job
- `getParsingHistory(cvId)` - Get parsing history

### 6. Optimization Jobs (`optimization-job.service.ts`)
AI-powered CV optimization.

```typescript
import { startFullOptimization, tailorForJob } from "@/services/optimization-job.service";
```

**Endpoints:**
- `startFullOptimization(data)` - Start full optimization
- `tailorForJob(data)` - Tailor CV for job description

### 7. ATS Analysis (`ats-analysis.service.ts`)
Applicant Tracking System analysis.

```typescript
import { 
  startATSAnalysis,
  getATSAnalysisHistory,
  getATSStats,
  getATSTrends,
  getRecentScores,
  getATSAnalysisStatus,
  getATSAnalysisResult,
  cancelATSAnalysis
} from "@/services/ats-analysis.service";
```

**Endpoints:**
- `startATSAnalysis(data)` - Start ATS analysis
- `getATSAnalysisHistory()` - Get analysis history
- `getATSStats()` - Get overall statistics
- `getATSTrends()` - Get scoring trends
- `getRecentScores()` - Get recent scores
- `getATSAnalysisStatus(jobId)` - Get job status
- `getATSAnalysisResult(jobId)` - Get analysis result
- `cancelATSAnalysis(jobId)` - Cancel analysis

### 8. PDF Generation (`pdf-generation.service.ts`)
PDF generation and download.

```typescript
import { generatePDF, downloadPDF } from "@/services/pdf-generation.service";
```

**Endpoints:**
- `generatePDF(data)` - Start PDF generation job
- `downloadPDF(jobId)` - Download generated PDF

**Templates:** `modern`, `classic`, `creative`

### 9. Jobs Management (`job.service.ts`)
Unified job management for all background jobs.

```typescript
import { 
  listJobs, 
  getJobStats, 
  getJobDetails, 
  getJobLogs, 
  cancelJob, 
  retryJob 
} from "@/services/job.service";
```

**Endpoints:**
- `listJobs()` - List all jobs
- `getJobStats()` - Get job statistics
- `getJobDetails(jobId)` - Get job details
- `getJobLogs(jobId)` - Get job logs
- `cancelJob(jobId)` - Cancel job
- `retryJob(jobId)` - Retry failed job

### 10. Webhooks (`webhook.service.ts`)
Webhook management for real-time notifications.

```typescript
import { createWebhook, listWebhooks, getWebhookStats } from "@/services/webhook.service";
```

**Endpoints:**
- `createWebhook(data)` - Register webhook
- `listWebhooks()` - List all webhooks
- `getWebhookStats()` - Get delivery statistics

**Events:** `cv.parsed`, `cv.optimized`, `pdf.generated`, `ats.analysis.completed`, `job.completed`, `job.failed`

## Usage Examples

### Basic Authentication Flow

```typescript
import { register, login, getCurrentUser } from "@/services/auth.service";

// Register
const registerResponse = await register({
  email: "user@example.com",
  password: "SecurePass123!",
  firstName: "John",
  lastName: "Doe"
});

// Login
const loginResponse = await login({
  email: "user@example.com",
  password: "SecurePass123!"
});

// Get current user
const user = await getCurrentUser();
```

### CV Management

```typescript
import { uploadCV, getCVById, updateCV, deleteCV } from "@/services/cv.service";

// Upload CV file
const file = new File([...], "resume.pdf");
const uploadResponse = await uploadCV(file);
const cvId = uploadResponse.data.data.id;

// Get CV details
const cv = await getCVById(cvId);

// Update CV
await updateCV(cvId, {
  title: "Updated Title",
  // ... other fields
});

// Delete CV
await deleteCV(cvId);
```

### ATS Analysis

```typescript
import { startATSAnalysis, getATSAnalysisResult } from "@/services/ats-analysis.service";

// Start analysis
const analysisResponse = await startATSAnalysis({
  cvId: "cv-123",
  targetJob: {
    title: "Software Engineer",
    description: "Looking for a software engineer..."
  }
});

const jobId = analysisResponse.data.data.id;

// Poll for result (in real app, use polling or webhooks)
const result = await getATSAnalysisResult(jobId);
console.log(`ATS Score: ${result.data.data.score}`);
```

### PDF Generation

```typescript
import { generatePDF, downloadPDF } from "@/services/pdf-generation.service";

// Generate PDF
const pdfJob = await generatePDF({
  cvId: "cv-123",
  template: "modern"
});

const jobId = pdfJob.data.data.id;

// Download PDF (returns blob)
const pdfBlob = await downloadPDF(jobId);
const url = URL.createObjectURL(pdfBlob);
// Use URL for download or display
```

## Error Handling

All services use the axios instance configured in `lib/axios.ts`, which includes:
- Automatic token injection
- Token refresh on 401 errors
- Automatic redirect to login on auth failure

Handle errors using try-catch:

```typescript
try {
  const cv = await getCVById("cv-123");
} catch (error) {
  if (error.response?.status === 404) {
    console.log("CV not found");
  } else {
    console.error("Error:", error.message);
  }
}
```

## TypeScript Support

All services are fully typed with TypeScript interfaces. Import types as needed:

```typescript
import type { 
  CVResponse, 
  CVListResponse,
  ATSAnalysisResponse 
} from "@/services";
```

## Base URL Configuration

The base URL is configured in `lib/axios.ts` using `process.env.NEXT_PUBLIC_BASE_URL`. 

Set it in your `.env.local`:
```
NEXT_PUBLIC_BASE_URL=https://careerforge-backend-production.up.railway.app
```

## Notes

- All endpoints require authentication except health checks
- Most endpoints return responses in the format: `{ success: boolean, data: T, message?: string }`
- File uploads use `FormData` and `multipart/form-data`
- PDF downloads return `blob` response type
- Job-based endpoints return job IDs that can be used to check status
