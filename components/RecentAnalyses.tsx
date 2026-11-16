"use client";

import Link from "next/link";
import { clearHistory, useHistory } from "@/lib/history";
import { displayHost } from "@/lib/format";
import { rateScore } from "@/lib/thresholds";
import { RatingMark } from "./RatingMark";

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function ago(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 60) return relative.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return relative.format(-hours, "hour");
  return relative.format(-Math.round(hours / 24), "day");
}

export function RecentAnalyses() {
  const history = useHistory();
  if (history.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="mt-16">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="recent-heading" className="text-sm font-medium">
          Your recent tests
        </h2>
        <button type="button" onClick={clearHistory} className="text-sm text-faint hover:text-fg">
          Clear
        </button>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {history.map((entry) => (
          <li key={`${entry.url}-${entry.strategy}`}>
            <Link
              href={`/result?${new URLSearchParams({ url: entry.url, strategy: entry.strategy })}`}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-0.5 py-3 hover:bg-panel sm:grid-cols-[1fr_6rem_8rem_3.5rem] sm:px-2"
            >
              <span className="truncate">{displayHost(entry.url)}</span>
              <span className="order-3 text-sm capitalize text-faint sm:order-none">{entry.strategy}</span>
              <span className="order-4 text-sm text-faint sm:order-none">
                <time dateTime={entry.at} suppressHydrationWarning>
                  {ago(entry.at)}
                </time>
              </span>
              <span className="row-span-2 flex items-center justify-end gap-2 sm:row-span-1">
                {entry.score !== null && <RatingMark rating={rateScore(entry.score)} />}
                <span className="num">{entry.score ?? "–"}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
