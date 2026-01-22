export interface Metric {
  name: string;
  value: number;
  displayValue: string;
  unit: string;
  score: number; 
  label: "Good" | "Needs Improvement" | "Poor";
  description: string;
}

export interface BundleAsset {
    name: string;
    size: number; 
    type: "js" | "css" | "image" | "font" | "other";
}

export interface WaterfallEvent {
    name: string;
    startTime: number;
    duration: number;
    type: "network" | "render" | "script";
}

export interface AnalysisResult {
  url: string;
  timestamp: string;
  performanceScore: number;
  metrics: {
    lcp: Metric;
    cls: Metric;
    fid: Metric;
    inp: Metric;
    fcp: Metric;
    ttfb: Metric;
  };
  bundleSize: number; 
  assets: BundleAsset[];
  waterfall: WaterfallEvent[];
  suggestions: string[];
}
