import Link from "next/link";
import type { Report } from "@/lib/report";
import { displayHost } from "@/lib/format";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

export function ReportHeader({ report }: { report: Report }) {
  const redirected = report.finalUrl.replace(/\/$/, "") !== report.requestedUrl.replace(/\/$/, "");
  const rerun = new URLSearchParams({ url: report.requestedUrl, strategy: report.strategy, fresh: "1" });

  return (
    <header className="pb-10 pt-8">
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Test another page
      </Link>

      {report.sample && (
        <p className="mt-6 rounded-md border border-line-strong bg-panel px-4 py-3 text-sm">
          This is a sample report for a fictional store, not a real measurement.{" "}
          <Link href="/" className="underline underline-offset-4">
            Test a real page
          </Link>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="min-w-0 break-words text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {report.sample ? (
            displayHost(report.finalUrl)
          ) : (
            <a href={report.finalUrl} className="hover:underline hover:decoration-line-strong hover:underline-offset-8">
              {displayHost(report.finalUrl)}
            </a>
          )}
        </h1>
        {!report.sample && (
          <Link
            href={`/result?${rerun}`}
            className="inline-flex h-10 shrink-0 items-center self-start rounded-md border border-line-strong px-4 text-sm hover:border-fg sm:self-auto"
          >
            Run again
          </Link>
        )}
      </div>

      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-faint">Device</dt>
          <dd className="capitalize">{report.strategy}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-faint">Tested</dt>
          <dd>
            <time dateTime={report.fetchedAt}>{dateFormat.format(new Date(report.fetchedAt))}</time>
          </dd>
        </div>
        {report.lighthouseVersion && (
          <div className="flex gap-2">
            <dt className="text-faint">Lighthouse</dt>
            <dd className="num">{report.lighthouseVersion}</dd>
          </div>
        )}
        {redirected && (
          <div className="flex min-w-0 gap-2">
            <dt className="text-faint">Redirected from</dt>
            <dd className="truncate">{displayHost(report.requestedUrl)}</dd>
          </div>
        )}
      </dl>

      {report.warnings.length > 0 && (
        <ul className="mt-5 space-y-1 text-sm text-ni">
          {report.warnings.map((w) => (
            <li key={w}>Lighthouse warning: {w}</li>
          ))}
        </ul>
      )}
    </header>
  );
}
