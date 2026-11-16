import type { Opportunity } from "@/lib/report";
import { formatBytes, formatMs } from "@/lib/format";
import { Section } from "./Section";

/** Lighthouse titles mark code with backticks, e.g. "Avoid `document.write()`" */
function Title({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") ? (
          <code key={i} className="num rounded bg-panel px-1 text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Opportunities({ items }: { items: Opportunity[] }) {
  const maxMs = Math.max(1, ...items.map((o) => o.savingsMs));
  return (
    <Section
      id="fixes"
      title="What to fix first"
      note="Ordered by Lighthouse's estimated time saved, then by bytes and layout shift. The estimates overlap, so they don't add up to a total."
    >
      {items.length === 0 ? (
        <p className="rounded-md bg-panel px-5 py-6 text-sm text-muted">
          Lighthouse didn&apos;t find anything with a measurable estimated saving on this run.
        </p>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {items.map((o) => (
            <li key={o.id} className="grid gap-x-8 gap-y-2 py-4 sm:grid-cols-[1fr_12rem] sm:items-center">
              <div className="min-w-0">
                <p>
                  <Title text={o.title} />
                </p>
                {o.detail && <p className="mt-0.5 text-sm text-muted">{o.detail}</p>}
              </div>
              <div className="flex items-center gap-3 sm:justify-end">
                {o.savingsMs > 0 && (
                  <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-line sm:block" aria-hidden="true">
                    <span className="bar-in block h-full bg-fg" style={{ width: `${(o.savingsMs / maxMs) * 100}%` }} />
                  </span>
                )}
                <span className="num whitespace-nowrap text-sm">
                  {o.savingsMs > 0
                    ? `−${formatMs(o.savingsMs)}`
                    : o.savingsBytes > 0
                      ? `−${formatBytes(o.savingsBytes)}`
                      : o.savingsCls > 0
                        ? `−${o.savingsCls.toFixed(2)} CLS`
                        : ""}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
