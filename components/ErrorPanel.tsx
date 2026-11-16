import Link from "next/link";
import type { ReportErrorCode } from "@/lib/report";

const copy: Record<ReportErrorCode, { title: string; hint: string }> = {
  "missing-key": {
    title: "PageSpeed Insights isn't set up here",
    hint: "Google no longer serves requests without an API key. Add PSI_API_KEY to the environment and redeploy.",
  },
  quota: {
    title: "Daily test limit reached",
    hint: "This site has used its PageSpeed Insights quota. It resets at midnight Pacific time, or you can run the same test on pagespeed.web.dev.",
  },
  "invalid-url": {
    title: "That address can't be tested",
    hint: "Use a full public address like https://example.com. Local, private and non-web addresses won't work.",
  },
  unreachable: {
    title: "Lighthouse couldn't load the page",
    hint: "Check that the page is public, doesn't need a login, and returns HTML.",
  },
  timeout: {
    title: "The test took too long",
    hint: "Very heavy pages sometimes time out. Running it again usually works.",
  },
  upstream: {
    title: "The test didn't finish",
    hint: "PageSpeed Insights returned an error. Running it again usually works.",
  },
};

export function ErrorPanel({
  code,
  message,
  retryHref,
  url,
}: {
  code: ReportErrorCode;
  message?: string;
  retryHref?: string;
  url?: string;
}) {
  const { title, hint } = copy[code];
  const psiHref = url ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}` : "https://pagespeed.web.dev/";
  return (
    <div className="max-w-2xl py-20" role="alert">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {message && <p className="mt-3 text-muted">{message}</p>}
      <p className="mt-3 text-muted">{hint}</p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        {retryHref && (
          <Link href={retryHref} className="inline-flex h-10 items-center rounded-md bg-fg px-4 font-medium text-bg hover:opacity-85">
            Try again
          </Link>
        )}
        <Link href="/" className="inline-flex h-10 items-center rounded-md border border-line-strong px-4 hover:border-fg">
          Test another page
        </Link>
        {(code === "quota" || code === "missing-key") && (
          <a href={psiHref} className="inline-flex h-10 items-center rounded-md border border-line-strong px-4 hover:border-fg">
            Open in PageSpeed Insights
          </a>
        )}
        <Link href="/result?sample=1" className="inline-flex h-10 items-center px-2 text-muted underline underline-offset-4 hover:text-fg">
          See a sample report
        </Link>
      </div>
    </div>
  );
}
