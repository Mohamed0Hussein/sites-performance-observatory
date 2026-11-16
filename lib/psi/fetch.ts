import "server-only";
import { ReportError, type Report, type Strategy } from "../report";
import { parsePsi } from "./parse";
import type { PsiErrorBody, PsiResponse } from "./raw";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** Results for the same URL and device are reused for five minutes. "Run again" bypasses this. */
const CACHE_SECONDS = 300;

function errorFromPsi(status: number, body: PsiErrorBody): ReportError {
  const message = body.error?.message ?? "";
  if (status === 429) {
    return new ReportError("quota", "The PageSpeed Insights quota for this site is used up for now.");
  }
  if (/api key not valid|API_KEY_INVALID/i.test(message)) {
    return new ReportError("missing-key", "PageSpeed Insights rejected the API key.");
  }
  const lighthouseCode = message.match(/Lighthouse returned error: (\w+)/)?.[1];
  switch (lighthouseCode) {
    case "FAILED_DOCUMENT_REQUEST":
    case "ERRORED_DOCUMENT_REQUEST":
    case "DNS_FAILURE":
    case "NOT_HTML":
    case "INSECURE_DOCUMENT_REQUEST":
      return new ReportError("unreachable", "Lighthouse couldn't load that page. Check that it's public and returns HTML.");
    case "NO_FCP":
      return new ReportError("upstream", "The page never painted any content, so Lighthouse couldn't measure it.");
    default:
      break;
  }
  if (status === 400) return new ReportError("invalid-url", "PageSpeed Insights couldn't test that URL.");
  return new ReportError("upstream", "PageSpeed Insights returned an error. Try again in a minute.");
}

export async function fetchReport(url: string, strategy: Strategy, { fresh = false } = {}): Promise<Report> {
  const key = process.env.PSI_API_KEY;
  if (!key) {
    throw new ReportError("missing-key", "This deployment has no PageSpeed Insights API key configured.");
  }

  const params = new URLSearchParams({ url, strategy, category: "performance", key });
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?${params}`, {
      signal: AbortSignal.timeout(55_000),
      ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: CACHE_SECONDS } }),
    });
  } catch (err) {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      throw new ReportError("timeout", "PageSpeed Insights took longer than 55 seconds to answer.");
    }
    throw new ReportError("upstream", "Couldn't reach PageSpeed Insights.");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as PsiErrorBody;
    throw errorFromPsi(res.status, body);
  }

  const data = (await res.json()) as PsiResponse;
  const runtime = data.lighthouseResult?.runtimeError;
  if (runtime?.code && runtime.code !== "NO_ERROR") {
    throw new ReportError("unreachable", runtime.message ?? "Lighthouse couldn't load that page.");
  }
  return parsePsi(data, url, strategy);
}
