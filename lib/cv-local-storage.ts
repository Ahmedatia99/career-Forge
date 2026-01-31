/**
 * Local Storage utility for CV data
 * Saves CV changes locally since the API doesn't support content PATCH
 */

import type { CV } from "@/types/types";

const CV_STORAGE_PREFIX = "cv_local_";
const CV_LIST_KEY = "cv_local_list";

export interface LocalCVData {
  cv: CV;
  lastModified: string;
  isDirty: boolean; // Has unsaved changes compared to server
}

/**
 * Get the storage key for a CV
 */
const getStorageKey = (cvId: string): string => {
  return `${CV_STORAGE_PREFIX}${cvId}`;
};

/**
 * Save CV data to local storage
 */
export const saveLocalCV = (cvId: string, cv: CV): void => {
  if (typeof window === "undefined") return;

  const data: LocalCVData = {
    cv,
    lastModified: new Date().toISOString(),
    isDirty: true,
  };

  try {
    localStorage.setItem(getStorageKey(cvId), JSON.stringify(data));
    
    // Update CV list
    const list = getLocalCVList();
    if (!list.includes(cvId)) {
      list.push(cvId);
      localStorage.setItem(CV_LIST_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.error("Failed to save CV to local storage:", err);
  }
};

/**
 * Get CV data from local storage
 */
export const getLocalCV = (cvId: string): LocalCVData | null => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(getStorageKey(cvId));
    if (data) {
      return JSON.parse(data) as LocalCVData;
    }
  } catch (err) {
    console.error("Failed to get CV from local storage:", err);
  }
  return null;
};

/**
 * Check if local CV exists and has changes
 */
export const hasLocalChanges = (cvId: string): boolean => {
  const localData = getLocalCV(cvId);
  return localData?.isDirty ?? false;
};

/**
 * Get the local CV or server CV (local takes priority if dirty)
 */
export const getLocalOrServerCV = (cvId: string, serverCV: CV): CV => {
  const localData = getLocalCV(cvId);
  
  // If we have local changes, use local data
  if (localData?.isDirty) {
    return localData.cv;
  }
  
  return serverCV;
};

/**
 * Mark local CV as synced (not dirty)
 */
export const markLocalCVAsSynced = (cvId: string): void => {
  if (typeof window === "undefined") return;

  const localData = getLocalCV(cvId);
  if (localData) {
    localData.isDirty = false;
    try {
      localStorage.setItem(getStorageKey(cvId), JSON.stringify(localData));
    } catch (err) {
      console.error("Failed to mark CV as synced:", err);
    }
  }
};

/**
 * Remove CV from local storage
 */
export const removeLocalCV = (cvId: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getStorageKey(cvId));
    
    // Update CV list
    const list = getLocalCVList();
    const index = list.indexOf(cvId);
    if (index > -1) {
      list.splice(index, 1);
      localStorage.setItem(CV_LIST_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.error("Failed to remove CV from local storage:", err);
  }
};

/**
 * Get list of all locally stored CV IDs
 */
export const getLocalCVList = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const list = localStorage.getItem(CV_LIST_KEY);
    if (list) {
      return JSON.parse(list) as string[];
    }
  } catch (err) {
    console.error("Failed to get CV list from local storage:", err);
  }
  return [];
};

/**
 * Get all locally stored CVs with their data
 */
export const getAllLocalCVs = (): Map<string, LocalCVData> => {
  const result = new Map<string, LocalCVData>();
  const list = getLocalCVList();

  for (const cvId of list) {
    const data = getLocalCV(cvId);
    if (data) {
      result.set(cvId, data);
    }
  }

  return result;
};

/**
 * Clear all local CV data
 */
export const clearAllLocalCVs = (): void => {
  if (typeof window === "undefined") return;

  try {
    const list = getLocalCVList();
    for (const cvId of list) {
      localStorage.removeItem(getStorageKey(cvId));
    }
    localStorage.removeItem(CV_LIST_KEY);
  } catch (err) {
    console.error("Failed to clear local CVs:", err);
  }
};

/**
 * Export CV data for PDF generation (uses local data if available)
 */
export const getCVForExport = (cvId: string, serverCV?: CV): CV | null => {
  // Try local storage first
  const localData = getLocalCV(cvId);
  if (localData) {
    return localData.cv;
  }
  
  // Fall back to server CV
  return serverCV || null;
};

/**
 * Auto-save debounce utility
 */
let autoSaveTimeout: NodeJS.Timeout | null = null;

export const autoSaveCV = (cvId: string, cv: CV, delay: number = 1000): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    saveLocalCV(cvId, cv);
    console.log("CV auto-saved to local storage");
  }, delay);
};

/**
 * Cancel pending auto-save
 */
export const cancelAutoSave = (): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
};
