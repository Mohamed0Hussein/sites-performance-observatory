"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { displayHost } from "@/lib/format";

/** Honest progress: PageSpeed Insights doesn't report stages, so this shows elapsed time, not a fake percentage. */
export function TestProgress() {
  const params = useSearchParams();
  const url = params.get("url");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div role="status" aria-live="polite">
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Cancel
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        {url ? `Testing ${displayHost(url)}` : "Preparing report"}
      </h1>
      <p className="mt-3 text-muted">
        Lighthouse is loading the page on Google&apos;s servers. This usually takes 15 to 30 seconds.{" "}
        <span className="num text-fg">{seconds}s</span>
      </p>
      {seconds > 40 && <p className="mt-2 text-sm text-faint">Still going. Heavy pages can take up to a minute.</p>}
    </div>
  );
}
