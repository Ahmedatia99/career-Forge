import { toast } from "sonner";

export interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show success toast notification
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration || 3000,
  });
};

/**
 * Show error toast notification
 */
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration || 5000,
  });
};

/**
 * Show info toast notification
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    duration: options?.duration || 3000,
  });
};

/**
 * Show warning toast notification
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    duration: options?.duration || 4000,
  });
};

/**
 * Show loading toast notification
 */
export const showLoading = (message: string) => {
  return toast.loading(message);
};

/**
 * Show promise toast notification
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

/**
 * Dismiss toast by ID
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};
