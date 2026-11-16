import type { FieldData, FieldMetric } from "@/lib/report";
import { formatPercent } from "@/lib/format";
import { RatingMark } from "../RatingMark";
import { Section } from "./Section";

const SEGMENTS = [
  { label: "good", color: "var(--good)" },
  { label: "needs improvement", color: "var(--ni)" },
  { label: "poor", color: "var(--poor)" },
] as const;

function Distribution({ metric }: { metric: FieldMetric }) {
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        {metric.distribution.map((share, i) => (
          <span
            key={SEGMENTS[i]!.label}
            className="bar-in h-full"
            style={{ width: `${share * 100}%`, background: SEGMENTS[i]!.color, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <p className="mt-2 flex flex-wrap gap-x-4 text-xs text-muted">
        {metric.distribution.map((share, i) => (
          <span key={SEGMENTS[i]!.label}>
            <span className="num text-fg">{formatPercent(share)}</span> {SEGMENTS[i]!.label}
          </span>
        ))}
      </p>
    </div>
  );
}

function Row({ metric }: { metric: FieldMetric }) {
  return (
    <li className="grid gap-x-8 gap-y-3 py-5 md:grid-cols-[15rem_12rem_1fr] md:items-center">
      <div>
        <p className="font-medium">{metric.name}</p>
        <p className="text-sm text-faint">{metric.id}</p>
      </div>
      <div className="flex items-baseline gap-3 md:block">
        <p className="num text-2xl">{metric.display}</p>
        <p className="whitespace-nowrap text-sm">
          <RatingMark rating={metric.rating} labelled />
        </p>
      </div>
      <Distribution metric={metric} />
    </li>
  );
}

export function FieldSection({ field }: { field: FieldData | null }) {
  const scope =
    field?.scope === "origin"
      ? "This page doesn't have enough traffic on its own, so these numbers cover the whole site."
      : "These numbers are for this exact page.";

  return (
    <Section
      id="field"
      title="Real users"
      note={
        <>
          The 75th percentile of Chrome visits over the last 28 days, from the Chrome UX Report.{" "}
          {field && scope}
        </>
      }
    >
      {field ? (
        <>
          <ul className="divide-y divide-line">
            {field.metrics.filter((m) => m.core).map((m) => (
              <Row key={m.id} metric={m} />
            ))}
          </ul>
          {field.metrics.some((m) => !m.core) && (
            <>
              <h3 className="mt-8 text-sm font-medium text-muted">Also measured, not part of the assessment</h3>
              <ul className="divide-y divide-line">
                {field.metrics.filter((m) => !m.core).map((m) => (
                  <Row key={m.id} metric={m} />
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p className="rounded-md bg-panel px-5 py-6 text-sm leading-relaxed text-muted">
          No real-user data yet. Chrome only reports on pages and sites with enough eligible visits, so new or
          low-traffic sites usually show up here after a few weeks of traffic.
        </p>
      )}
    </Section>
  );
}
