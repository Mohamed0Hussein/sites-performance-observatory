import type { Report } from "@/lib/report";
import { rateScore } from "@/lib/thresholds";
import { RatingMark } from "../RatingMark";

function Gauge({ score }: { score: number }) {
  const rating = rateScore(score);
  const color = rating === "good" ? "var(--good)" : rating === "needs-improvement" ? "var(--ni)" : "var(--poor)";
  const r = 44;
  const circumference = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
      />
    </svg>
  );
}

export function Summary({ report }: { report: Report }) {
  const { score, field } = report;
  const verdict = field?.passed === true ? "Passed" : field?.passed === false ? "Failed" : "Not enough data";
  const failing = field?.metrics.filter((m) => m.core && m.rating !== "good").map((m) => m.id) ?? [];

  return (
    <div className="grid border-y border-line md:grid-cols-2">
      <div className="flex items-center gap-6 py-8 md:pr-10">
        {score !== null ? (
          <div className="relative">
            <Gauge score={score} />
            <span className="num absolute inset-0 flex items-center justify-center text-4xl font-medium">{score}</span>
          </div>
        ) : (
          <span className="num flex h-28 w-28 items-center justify-center text-4xl text-faint">–</span>
        )}
        <div>
          <p className="text-sm text-faint">Lighthouse performance score</p>
          {score !== null ? (
            <p className="mt-1 text-lg">
              <RatingMark rating={rateScore(score)} labelled />
            </p>
          ) : (
            <p className="mt-1 text-lg">Couldn&apos;t be scored</p>
          )}
          <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">
            One simulated load in a lab. It moves between runs, so treat a few points either way as noise.
          </p>
        </div>
      </div>

      <div className="border-t border-line py-8 md:border-l md:border-t-0 md:pl-10">
        <p className="text-sm text-faint">Core Web Vitals assessment</p>
        <p className="mt-1 flex items-center gap-2.5 text-3xl font-semibold tracking-tight">
          {field?.passed === true && <RatingMark rating="good" />}
          {field?.passed === false && <RatingMark rating="poor" />}
          {verdict}
        </p>
        <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted">
          {field?.passed === true &&
            "LCP, INP and CLS are all good for at least 75% of real visits. This is what Google uses in search ranking."}
          {field?.passed === false &&
            `${failing.join(" and ")} ${failing.length === 1 ? "isn't" : "aren't"} good for at least 75% of real visits. All three have to pass.`}
          {field?.passed === null &&
            (field
              ? "Chrome has data for some metrics but not all three Core Web Vitals."
              : "The Chrome UX Report has too few real visits to this page to report on. The lab test below still applies.")}
        </p>
      </div>
    </div>
  );
}
