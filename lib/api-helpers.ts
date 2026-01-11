import { retry } from "./retry";
import { showError, showSuccess, showPromise } from "./toast";
import type { AxiosError } from "axios";

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

/**
 * Handle API error with toast notification
 */
export function handleApiError(error: any, customMessage?: string) {
  const message = customMessage || getErrorMessage(error);
  showError(message);
  console.error("API Error:", error);
  return error;
}

/**
 * Execute API call with retry and error handling
 */
export async function withRetryAndToast<T>(
  apiCall: () => Promise<T>,
  options: {
    successMessage?: string;
    errorMessage?: string;
    retryOptions?: Parameters<typeof retry>[1];
    showLoading?: boolean;
  } = {}
): Promise<T> {
  const {
    successMessage,
    errorMessage,
    retryOptions,
    showLoading = false,
  } = options;

  try {
    let result: T;

    if (showLoading && successMessage) {
      // Use promise toast for loading state
      result = await showPromise(
        retry(apiCall, retryOptions),
        {
          loading: "Processing...",
          success: successMessage,
          error: errorMessage || getErrorMessage,
        }
      );
    } else {
      result = await retry(apiCall, retryOptions);
      if (successMessage) {
        showSuccess(successMessage);
      }
    }

    return result;
  } catch (error: any) {
    handleApiError(error, errorMessage);
    throw error;
  }
}

/**
 * Create optimistic update wrapper for API calls
 */
export function createOptimisticApiCall<T, R>(
  apiCall: () => Promise<R>,
  optimisticData: T,
  options: {
    onSuccess?: (data: R) => void;
    onError?: (error: any, rollbackData: T) => void;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  return async (updateState: (data: T) => void, rollbackState: (data: T) => void) => {
    // Apply optimistic update
    updateState(optimisticData);

    try {
      const result = await apiCall();
      options.onSuccess?.(result);
      if (options.successMessage) {
        showSuccess(options.successMessage);
      }
      return result;
    } catch (error: any) {
      // Rollback on error
      rollbackState(optimisticData);
      options.onError?.(error, optimisticData);
      handleApiError(error, options.errorMessage);
      throw error;
    }
  };
}
