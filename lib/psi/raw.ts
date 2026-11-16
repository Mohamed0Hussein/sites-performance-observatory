/**
 * The parts of the PageSpeed Insights v5 response this app reads.
 * Every field is optional because Lighthouse omits audits it could not run.
 * Reference: https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed
 */

export interface PsiDistribution {
  min: number;
  max?: number;
  proportion: number;
}

export interface PsiFieldMetric {
  percentile?: number;
  distributions?: PsiDistribution[];
  category?: "FAST" | "AVERAGE" | "SLOW" | string;
}

export interface PsiLoadingExperience {
  id?: string;
  origin_fallback?: boolean;
  overall_category?: string;
  metrics?: Partial<Record<string, PsiFieldMetric>>;
}

export interface PsiAuditItem {
  [key: string]: unknown;
}

export interface PsiAudit {
  id?: string;
  title?: string;
  score?: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  metricSavings?: Partial<Record<"LCP" | "FCP" | "TBT" | "CLS" | "INP", number>>;
  details?: {
    type?: string;
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
    items?: PsiAuditItem[];
  };
}

export interface PsiAuditRef {
  id: string;
  weight: number;
  group?: string;
  acronym?: string;
}

export interface PsiResponse {
  id?: string;
  analysisUTCTimestamp?: string;
  loadingExperience?: PsiLoadingExperience;
  originLoadingExperience?: PsiLoadingExperience;
  lighthouseResult?: {
    requestedUrl?: string;
    finalDisplayedUrl?: string;
    finalUrl?: string;
    fetchTime?: string;
    lighthouseVersion?: string;
    runWarnings?: string[];
    runtimeError?: { code?: string; message?: string };
    configSettings?: { formFactor?: string };
    categories?: {
      performance?: { score?: number | null; auditRefs?: PsiAuditRef[] };
    };
    audits?: Record<string, PsiAudit>;
  };
}

export interface PsiErrorBody {
  error?: { code?: number; message?: string; status?: string };
}
