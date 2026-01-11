import api from "@/lib/axios";

export interface HealthResponse {
  success: boolean;
  data: {
    status: string;
    timestamp: string;
  };
}

export interface DetailedHealthResponse {
  success: boolean;
  data: {
    status: string;
    database: {
      status: string;
      connected: boolean;
    };
    timestamp: string;
  };
}

export interface MetricsResponse {
  [key: string]: string | number;
}

/**
 * Basic health check (no auth required)
 */
export const healthCheck = () => {
  return api.get<HealthResponse>("/health");
};

/**
 * Detailed health check with database status
 */
export const detailedHealthCheck = () => {
  return api.get<DetailedHealthResponse>("/v1/health");
};

/**
 * Readiness probe - checks if the service is ready to accept traffic
 */
export const readinessProbe = () => {
  return api.get<HealthResponse>("/v1/health/ready");
};

/**
 * Prometheus-format metrics for monitoring
 */
export const getMetrics = () => {
  return api.get<MetricsResponse>("/v1/metrics");
};
