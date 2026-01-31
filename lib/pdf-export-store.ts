import type { CV } from "@/types/types";

const store = new Map<string, CV>();

export function setPdfExportData(id: string, cvData: CV): void {
  store.set(id, cvData);
}

export function getPdfExportData(id: string): CV | undefined {
  return store.get(id);
}

export function takePdfExportData(id: string): CV | undefined {
  const data = store.get(id);
  store.delete(id);
  return data;
}
