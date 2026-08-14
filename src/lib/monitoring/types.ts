export type HealthSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type HealthCategory =
  | "technical"
  | "indexation"
  | "seo"
  | "content"
  | "data"
  | "performance"
  | "links"
  | "analytics"
  | "revenue"
  | "security"
  | "deployment";

export interface HealthFinding {
  id: string;
  category: HealthCategory;
  severity: HealthSeverity;
  title: string;
  description: string;
  affectedUrls?: string[];
  affectedQueries?: string[];
  evidence?: Record<string, unknown>;
  firstDetectedAt: string;
  lastDetectedAt: string;
  status: "open" | "acknowledged" | "resolved";
  recommendedAction?: string;
  safeAutoFixable?: boolean;
}

export interface HealthReportSummary {
  overallStatus: "GOOD" | "WARNING" | "CRITICAL";
  timestamp: string;
  score: {
    total: number;
    technical: number;
    seo: number;
    data: number;
    performance: number;
    revenue: number;
  };
  findingCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  findings: HealthFinding[];
}
