import api from "@/lib/axios";

export type WebhookEvent = 
  | "cv.parsed" 
  | "cv.optimized" 
  | "pdf.generated" 
  | "ats.analysis.completed"
  | "job.completed"
  | "job.failed";

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookResponse {
  success: boolean;
  data: Webhook;
  message?: string;
}

export interface WebhookListResponse {
  success: boolean;
  data: Webhook[];
  message?: string;
}

export interface WebhookStatsResponse {
  success: boolean;
  data: {
    totalWebhooks: number;
    activeWebhooks: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    successRate: number;
  };
  message?: string;
}

export interface CreateWebhookRequest {
  url: string;
  events: WebhookEvent[];
}

/**
 * Register a new webhook endpoint
 */
export const createWebhook = (data: CreateWebhookRequest) => {
  return api.post<WebhookResponse>("/v1/webhooks", data);
};

/**
 * List all registered webhooks
 */
export const listWebhooks = () => {
  return api.get<WebhookListResponse>("/v1/webhooks");
};

/**
 * Get webhook delivery statistics
 */
export const getWebhookStats = () => {
  return api.get<WebhookStatsResponse>("/v1/webhooks/stats");
};
