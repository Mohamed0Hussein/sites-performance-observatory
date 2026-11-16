/** The shape the UI renders. Built from a PageSpeed Insights response by lib/psi/parse.ts. */

export type Rating = "good" | "needs-improvement" | "poor";
export type Strategy = "mobile" | "desktop";
export type ResourceKind = "document" | "script" | "stylesheet" | "image" | "font" | "media" | "fetch" | "other";

export interface FieldMetric {
  id: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  name: string;
  /** 75th percentile, in ms (or unitless for CLS) */
  p75: number;
  display: string;
  rating: Rating;
  /** Share of page loads that were good, needs improvement, poor. Sums to ~1. */
  distribution: [number, number, number];
  /** LCP, INP and CLS decide the Core Web Vitals assessment */
  core: boolean;
}

export interface FieldData {
  /** "url" when CrUX has data for this exact page, "origin" when PSI fell back to the whole site */
  scope: "url" | "origin";
  metrics: FieldMetric[];
  /** null when one of the three core metrics is missing */
  passed: boolean | null;
}

export interface LabMetric {
  id: "FCP" | "LCP" | "TBT" | "CLS" | "SI";
  name: string;
  value: number;
  display: string;
  /** 0–100 */
  score: number;
  rating: Rating;
  /** Share of the Lighthouse performance score, 0–100 */
  weight: number;
}

export interface Opportunity {
  id: string;
  title: string;
  /** Lighthouse's own one-line summary, e.g. "Est savings of 120 KiB" */
  detail: string | null;
  savingsMs: number;
  savingsBytes: number;
  /** Estimated reduction in layout shift, for fixes that save no time */
  savingsCls: number;
}

export interface NetworkRequest {
  url: string;
  host: string;
  name: string;
  kind: ResourceKind;
  /** ms from the first request */
  start: number;
  end: number;
  transferBytes: number;
  status: number | null;
  firstParty: boolean;
}

export interface WeightRow {
  kind: string;
  label: string;
  requests: number;
  bytes: number;
}

export interface Report {
  requestedUrl: string;
  finalUrl: string;
  strategy: Strategy;
  fetchedAt: string;
  lighthouseVersion: string | null;
  /** Lighthouse performance score 0–100, null if Lighthouse could not score the page */
  score: number | null;
  field: FieldData | null;
  lab: LabMetric[];
  opportunities: Opportunity[];
  requests: NetworkRequest[];
  /** Total number of requests Lighthouse recorded, before trimming for display */
  requestCount: number;
  weight: { total: WeightRow | null; rows: WeightRow[] };
  warnings: string[];
  /** True only for the bundled sample report */
  sample: boolean;
}

export type ReportErrorCode =
  | "missing-key"
  | "quota"
  | "invalid-url"
  | "unreachable"
  | "timeout"
  | "upstream";

export class ReportError extends Error {
  constructor(
    public readonly code: ReportErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ReportError";
  }
}
