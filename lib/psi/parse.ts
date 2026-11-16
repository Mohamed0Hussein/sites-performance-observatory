import type {
  FieldData,
  FieldMetric,
  LabMetric,
  NetworkRequest,
  Opportunity,
  Report,
  ResourceKind,
  Strategy,
  WeightRow,
} from "../report";
import { formatCls, formatMs } from "../format";
import { rateScore, rateValue } from "../thresholds";
import type { PsiAudit, PsiAuditItem, PsiLoadingExperience, PsiResponse } from "./raw";

const FIELD_METRICS = [
  { key: "LARGEST_CONTENTFUL_PAINT_MS", id: "LCP", name: "Largest Contentful Paint", core: true },
  { key: "INTERACTION_TO_NEXT_PAINT", id: "INP", name: "Interaction to Next Paint", core: true },
  { key: "CUMULATIVE_LAYOUT_SHIFT_SCORE", id: "CLS", name: "Cumulative Layout Shift", core: true },
  { key: "FIRST_CONTENTFUL_PAINT_MS", id: "FCP", name: "First Contentful Paint", core: false },
  { key: "EXPERIMENTAL_TIME_TO_FIRST_BYTE", id: "TTFB", name: "Time to First Byte", core: false },
] as const;

const LAB_METRICS = [
  { audit: "first-contentful-paint", id: "FCP", name: "First Contentful Paint" },
  { audit: "largest-contentful-paint", id: "LCP", name: "Largest Contentful Paint" },
  { audit: "total-blocking-time", id: "TBT", name: "Total Blocking Time" },
  { audit: "cumulative-layout-shift", id: "CLS", name: "Cumulative Layout Shift" },
  { audit: "speed-index", id: "SI", name: "Speed Index" },
] as const;

/** Audits that are measurements or containers, not things to fix */
const NOT_ACTIONABLE = new Set<string>([
  ...LAB_METRICS.map((m) => m.audit),
  "interactive",
  "max-potential-fid",
  "server-response-time",
  "network-requests",
  "resource-summary",
  "main-thread-tasks",
  "metrics",
  "screenshot-thumbnails",
  "final-screenshot",
  "full-page-screenshot",
  "diagnostics",
  "network-rtt",
  "network-server-latency",
  "script-treemap-data",
]);

function parseField(experience: PsiLoadingExperience | undefined): FieldData | null {
  const raw = experience?.metrics;
  if (!raw) return null;

  const metrics: FieldMetric[] = [];
  for (const def of FIELD_METRICS) {
    const m = raw[def.key];
    if (!m || typeof m.percentile !== "number") continue;
    // CrUX reports CLS multiplied by 100
    const p75 = def.id === "CLS" ? m.percentile / 100 : m.percentile;
    const d = m.distributions ?? [];
    metrics.push({
      id: def.id,
      name: def.name,
      p75,
      display: def.id === "CLS" ? formatCls(p75) : formatMs(p75),
      rating: rateValue(def.id, p75),
      distribution: [d[0]?.proportion ?? 0, d[1]?.proportion ?? 0, d[2]?.proportion ?? 0],
      core: def.core,
    });
  }
  if (metrics.length === 0) return null;

  const core = metrics.filter((m) => m.core);
  const passed = core.length === 3 ? core.every((m) => m.rating === "good") : null;
  return { scope: experience?.origin_fallback ? "origin" : "url", metrics, passed };
}

function parseLab(audits: Record<string, PsiAudit>, weights: Map<string, number>): LabMetric[] {
  const lab: LabMetric[] = [];
  for (const def of LAB_METRICS) {
    const a = audits[def.audit];
    if (!a || typeof a.numericValue !== "number") continue;
    const score = Math.round((a.score ?? 0) * 100);
    lab.push({
      id: def.id,
      name: def.name,
      value: a.numericValue,
      display: def.id === "CLS" ? formatCls(a.numericValue) : formatMs(a.numericValue),
      score,
      rating: rateScore(score),
      weight: weights.get(def.audit) ?? 0,
    });
  }
  return lab;
}

function savingsOf(a: PsiAudit): { ms: number; bytes: number; cls: number } {
  const ms = Math.max(
    a.details?.overallSavingsMs ?? 0,
    a.metricSavings?.LCP ?? 0,
    a.metricSavings?.FCP ?? 0,
    a.metricSavings?.TBT ?? 0,
    a.metricSavings?.INP ?? 0,
  );
  return { ms, bytes: a.details?.overallSavingsBytes ?? 0, cls: a.metricSavings?.CLS ?? 0 };
}

function parseOpportunities(audits: Record<string, PsiAudit>): Opportunity[] {
  const seen = new Set<string>();
  const list: Opportunity[] = [];

  for (const [id, a] of Object.entries(audits)) {
    if (NOT_ACTIONABLE.has(id) || !a.title) continue;
    if (a.score === null || a.score === undefined || a.score >= 0.9) continue;
    if (a.scoreDisplayMode === "informative" || a.scoreDisplayMode === "notApplicable" || a.scoreDisplayMode === "manual")
      continue;

    const { ms, bytes, cls } = savingsOf(a);
    const isOpportunity = a.details?.type === "opportunity" || ms > 0 || bytes > 0 || cls > 0;
    if (!isOpportunity) continue;

    const key = a.title.toLowerCase().replace(/[^a-z]/g, "");
    if (seen.has(key)) continue;
    seen.add(key);

    list.push({ id, title: a.title, detail: a.displayValue || null, savingsMs: ms, savingsBytes: bytes, savingsCls: cls });
  }

  return list
    .sort((x, y) => y.savingsMs - x.savingsMs || y.savingsBytes - x.savingsBytes || y.savingsCls - x.savingsCls)
    .slice(0, 8);
}

function num(item: PsiAuditItem, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = item[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return undefined;
}

function kindOf(resourceType: unknown): ResourceKind {
  switch (String(resourceType ?? "").toLowerCase()) {
    case "document":
      return "document";
    case "script":
      return "script";
    case "stylesheet":
      return "stylesheet";
    case "image":
      return "image";
    case "font":
      return "font";
    case "media":
      return "media";
    case "fetch":
    case "xhr":
      return "fetch";
    default:
      return "other";
  }
}

function siteOf(host: string): string {
  return host.split(".").slice(-2).join(".");
}

function requestName(url: URL): string {
  const last = url.pathname.split("/").filter(Boolean).pop();
  return last ? decodeURIComponent(last) : url.host;
}

function parseRequests(audits: Record<string, PsiAudit>, finalUrl: string): { requests: NetworkRequest[]; total: number } {
  const items = audits["network-requests"]?.details?.items ?? [];
  let pageSite = "";
  try {
    pageSite = siteOf(new URL(finalUrl).hostname);
  } catch {
    /* keep empty */
  }

  const parsed: NetworkRequest[] = [];
  for (const item of items) {
    if (typeof item.url !== "string" || item.url.startsWith("data:")) continue;
    // Lighthouse 10+ renamed startTime/endTime to networkRequestTime/networkEndTime
    const start = num(item, "networkRequestTime", "startTime");
    const end = num(item, "networkEndTime", "endTime");
    if (start === undefined) continue;
    let url: URL;
    try {
      url = new URL(item.url);
    } catch {
      continue;
    }
    parsed.push({
      url: item.url,
      host: url.host,
      name: requestName(url),
      kind: kindOf(item.resourceType),
      start,
      end: Math.max(end ?? start, start),
      transferBytes: num(item, "transferSize") ?? 0,
      status: num(item, "statusCode") ?? null,
      firstParty: siteOf(url.hostname) === pageSite,
    });
  }

  const origin = parsed.reduce((min, r) => Math.min(min, r.start), Number.POSITIVE_INFINITY);
  const normalized = parsed
    .map((r) => ({ ...r, start: r.start - origin, end: r.end - origin }))
    .sort((a, b) => a.start - b.start);

  return { requests: normalized.slice(0, 40), total: normalized.length };
}

const KIND_LABELS: Record<string, string> = {
  document: "HTML",
  script: "JavaScript",
  stylesheet: "CSS",
  image: "Images",
  font: "Fonts",
  media: "Media",
  fetch: "Data requests",
  other: "Other",
};

function parseWeight(audits: Record<string, PsiAudit>, requests: NetworkRequest[], totalRequests: number) {
  const items = audits["resource-summary"]?.details?.items;
  if (items && items.length > 0) {
    let total: WeightRow | null = null;
    const rows: WeightRow[] = [];
    for (const item of items) {
      const kind = String(item.resourceType ?? "other");
      const row: WeightRow = {
        kind,
        label: KIND_LABELS[kind] ?? String(item.label ?? kind),
        requests: num(item, "requestCount") ?? 0,
        bytes: num(item, "transferSize") ?? 0,
      };
      if (kind === "total") total = { ...row, label: "Total" };
      else if (kind !== "third-party" && row.requests > 0) rows.push(row);
    }
    return { total, rows: rows.sort((a, b) => b.bytes - a.bytes) };
  }

  // Older or trimmed responses: derive from the request list we have
  const byKind = new Map<string, WeightRow>();
  for (const r of requests) {
    const row = byKind.get(r.kind) ?? { kind: r.kind, label: KIND_LABELS[r.kind] ?? r.kind, requests: 0, bytes: 0 };
    row.requests += 1;
    row.bytes += r.transferBytes;
    byKind.set(r.kind, row);
  }
  const rows = [...byKind.values()].sort((a, b) => b.bytes - a.bytes);
  const bytes = rows.reduce((sum, r) => sum + r.bytes, 0);
  return { total: { kind: "total", label: "Total", requests: totalRequests, bytes }, rows };
}

export function parsePsi(data: PsiResponse, requestedUrl: string, strategy: Strategy, sample = false): Report {
  const lh = data.lighthouseResult;
  const audits = lh?.audits ?? {};
  const finalUrl = lh?.finalDisplayedUrl ?? lh?.finalUrl ?? data.id ?? requestedUrl;
  const weights = new Map((lh?.categories?.performance?.auditRefs ?? []).map((r) => [r.id, r.weight]));
  const rawScore = lh?.categories?.performance?.score;
  const { requests, total } = parseRequests(audits, finalUrl);

  return {
    requestedUrl,
    finalUrl,
    strategy,
    fetchedAt: lh?.fetchTime ?? data.analysisUTCTimestamp ?? new Date().toISOString(),
    lighthouseVersion: lh?.lighthouseVersion ?? null,
    score: typeof rawScore === "number" ? Math.round(rawScore * 100) : null,
    field: parseField(data.loadingExperience) ?? parseField(data.originLoadingExperience && { ...data.originLoadingExperience, origin_fallback: true }),
    lab: parseLab(audits, weights),
    opportunities: parseOpportunities(audits),
    requests,
    requestCount: total,
    weight: parseWeight(audits, requests, total),
    warnings: lh?.runWarnings ?? [],
    sample,
  };
}
