# Advanced Features Documentation

This document describes the advanced features added to improve user experience and application reliability.

## 1. Toast Notifications (`lib/toast.ts`)

Centralized toast notification system using Sonner.

### Usage

```typescript
import { showSuccess, showError, showInfo, showWarning, showPromise } from "@/lib/toast";

// Success notification
showSuccess("CV saved successfully!");

// Error notification
showError("Failed to save CV");

// Info notification
showInfo("Processing your request...");

// Warning notification
showWarning("This action cannot be undone");

// Promise-based notification (shows loading, then success/error)
showPromise(
  saveCV(),
  {
    loading: "Saving CV...",
    success: "CV saved successfully!",
    error: "Failed to save CV"
  }
);
```

## 2. Retry Logic (`lib/retry.ts`)

Automatic retry mechanism for failed API calls with exponential backoff.

### Features

- Configurable max retries
- Exponential backoff delay
- Custom retry conditions
- Retry callbacks

### Usage

```typescript
import { retry } from "@/lib/retry";

const result = await retry(
  () => apiCall(),
  {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (error) => error.response?.status >= 500,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}`);
    }
  }
);
```

## 3. Optimistic Updates (`lib/optimistic-updates.ts`)

Immediate UI updates before API confirmation for better perceived performance.

### Usage

```typescript
import { createListOptimisticHandler } from "@/lib/optimistic-updates";

const handler = createListOptimisticHandler(items);

// Optimistically add item
setItems(handler.add(newItem));
try {
  await createItem(newItem);
} catch (error) {
  // Rollback on error
  setItems(items);
}

// Optimistically update item
setItems(handler.update(itemId, updates));

// Optimistically delete item
setItems(handler.delete(itemId));
```

## 4. API Helpers (`lib/api-helpers.ts`)

Combined utilities for retry, toast, and error handling.

### Usage

```typescript
import { withRetryAndToast } from "@/lib/api-helpers";

const result = await withRetryAndToast(
  () => getUserCVs(),
  {
    successMessage: "CVs loaded successfully",
    errorMessage: "Failed to load CVs",
    retryOptions: {
      maxRetries: 2,
      retryDelay: 1000
    },
    showLoading: true // Shows promise toast
  }
);
```

## 5. Job Polling (`hooks/use-job-polling.ts`)

Hook for polling job status until completion.

### Usage

```typescript
import { useJobPolling } from "@/hooks/use-job-polling";

const { status, isLoading, error, data, startPolling, stopPolling } = useJobPolling({
  jobId: "job-123",
  checkStatus: async () => {
    const response = await getJobStatus("job-123");
    return {
      status: response.data.status,
      data: response.data
    };
  },
  onComplete: (data) => {
    console.log("Job completed!", data);
  },
  onError: (error) => {
    console.error("Job failed:", error);
  },
  pollInterval: 2000,
  maxPollAttempts: 60
});
```

## 6. Specialized Job Hooks

### Parsing Job (`hooks/use-parsing-job.ts`)

```typescript
import { useParsingJob } from "@/hooks/use-parsing-job";

const { status, isLoading } = useParsingJob(cvId, enabled);
```

### Optimization Job (`hooks/use-optimization-job.ts`)

```typescript
import { useOptimizationJob } from "@/hooks/use-optimization-job";

const { status, isLoading, data } = useOptimizationJob(jobId, enabled);
```

### PDF Generation (`hooks/use-pdf-generation.ts`)

```typescript
import { usePDFGeneration } from "@/hooks/use-pdf-generation";

const { status, isLoading } = usePDFGeneration(jobId, enabled);
```

## Implementation Examples

### Dashboard with Optimistic Updates

```typescript
const handleDeleteCV = async (id: string) => {
  const cvToDelete = cvs.find((cv) => cv.id === id);
  if (!cvToDelete) return;

  const optimisticHandler = createListOptimisticHandler(cvs);
  const optimisticCvs = optimisticHandler.delete(id);

  // Optimistic update
  setCvs(optimisticCvs);

  try {
    await withRetryAndToast(
      () => deleteCV(id),
      {
        successMessage: "CV deleted successfully",
        errorMessage: "Failed to delete CV"
      }
    );
  } catch (err) {
    // Rollback on error
    setCvs(cvs);
  }
};
```

### CV Upload with Polling

```typescript
const handleUpload = async () => {
  const response = await withRetryAndToast(
    () => uploadCV(file),
    {
      successMessage: "CV uploaded successfully",
      showLoading: true
    }
  );

  const cvId = response.data.data.id;
  
  // Start polling for parsing status
  const { status } = useParsingJob(cvId, true);
  
  // Redirect when parsing completes
  if (status === "completed") {
    router.push(`/cv-builder/${cvId}`);
  }
};
```

## Best Practices

1. **Use optimistic updates** for user-initiated actions (delete, update)
2. **Use retry logic** for network operations and server errors
3. **Show toast notifications** for all user-facing operations
4. **Use polling** for long-running jobs (parsing, optimization, PDF generation)
5. **Always rollback** optimistic updates on error
6. **Configure retry conditions** to avoid retrying on client errors (4xx)

## Configuration

### Retry Defaults

- Max retries: 3
- Initial delay: 1000ms
- Exponential backoff: delay * 2^attempt
- Retry condition: Network errors or 5xx server errors

### Polling Defaults

- Poll interval: 2000ms (2 seconds)
- Max attempts: 60 (2 minutes for parsing)
- Auto-start: Enabled when jobId is provided

### Toast Defaults

- Success duration: 3000ms
- Error duration: 5000ms
- Info duration: 3000ms
- Warning duration: 4000ms
