import type { Rating } from "./report";

/**
 * Official Web Vitals thresholds (web.dev/articles/vitals).
 * [good upper bound, poor lower bound]; values at or below the first are good,
 * values above the second are poor.
 */
export const thresholds = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
} as const;

export function rateValue(metric: keyof typeof thresholds, value: number): Rating {
  const [good, poor] = thresholds[metric];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

/** Lighthouse scores: 90+ good, 50–89 needs improvement, below 50 poor */
export function rateScore(score: number): Rating {
  if (score >= 90) return "good";
  if (score >= 50) return "needs-improvement";
  return "poor";
}

export const ratingLabel: Record<Rating, string> = {
  good: "Good",
  "needs-improvement": "Needs improvement",
  poor: "Poor",
};
