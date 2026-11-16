import type { Metadata } from "next";
import { fetchReport } from "@/lib/psi/fetch";
import { sampleReport } from "@/lib/psi/sample";
import { ReportError, type Report } from "@/lib/report";
import { normalizeUrl, parseStrategy } from "@/lib/url";
import { displayHost } from "@/lib/format";
import { ErrorPanel } from "@/components/ErrorPanel";
import { RecordInHistory } from "@/components/RecordInHistory";
import { ReportHeader } from "@/components/report/ReportHeader";
import { Summary } from "@/components/report/Summary";
import { FieldSection } from "@/components/report/FieldSection";
import { LabSection } from "@/components/report/LabSection";
import { Opportunities } from "@/components/report/Opportunities";
import { Waterfall } from "@/components/report/Waterfall";
import { PageWeight } from "@/components/report/PageWeight";

// PageSpeed Insights regularly takes 20–40 seconds
export const maxDuration = 60;
// Every report depends on the query string and a live API call
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  if (first(params.sample)) return { title: "Sample report", robots: { index: false } };
  const url = normalizeUrl(first(params.url) ?? "");
  return { title: url ? `Report for ${displayHost(url)}` : "Report", robots: { index: false } };
}

export default async function ResultPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const strategy = parseStrategy(first(params.strategy));

  let report: Report;
  if (first(params.sample)) {
    report = sampleReport(strategy);
  } else {
    const url = normalizeUrl(first(params.url) ?? "");
    if (!url) return <ErrorPanel code="invalid-url" />;
    try {
      report = await fetchReport(url, strategy, { fresh: first(params.fresh) === "1" });
    } catch (err) {
      const e = err instanceof ReportError ? err : new ReportError("upstream", "Something went wrong running the test.");
      if (!(err instanceof ReportError)) console.error(err);
      const retry = `/result?${new URLSearchParams({ url, strategy, fresh: "1" })}`;
      return <ErrorPanel code={e.code} message={e.message} retryHref={e.code === "missing-key" ? undefined : retry} url={url} />;
    }
  }

  return (
    <article className="pb-16">
      {!report.sample && <RecordInHistory url={report.requestedUrl} strategy={report.strategy} score={report.score} />}
      <ReportHeader report={report} />
      <Summary report={report} />
      <FieldSection field={report.field} />
      <LabSection lab={report.lab} strategy={report.strategy} />
      <Opportunities items={report.opportunities} />
      <Waterfall requests={report.requests} total={report.requestCount} />
      <PageWeight weight={report.weight} />
    </article>
  );
}
