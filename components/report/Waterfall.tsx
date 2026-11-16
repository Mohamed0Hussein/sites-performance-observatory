import type { NetworkRequest, ResourceKind } from "@/lib/report";
import { formatBytes } from "@/lib/format";
import { kindMeta } from "./kinds";
import { Section } from "./Section";

function niceStep(total: number): number {
  const rough = total / 5;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const unit = rough / pow;
  return (unit < 1.5 ? 1 : unit < 3.5 ? 2 : unit < 7.5 ? 5 : 10) * pow;
}

export function Waterfall({ requests, total }: { requests: NetworkRequest[]; total: number }) {
  if (requests.length === 0) return null;

  const span = Math.max(1, ...requests.map((r) => r.end));
  const step = niceStep(span);
  const ticks = Array.from({ length: Math.floor(span / step) + 1 }, (_, i) => i * step);
  const kinds = [...new Set(requests.map((r) => r.kind))] as ResourceKind[];
  const pct = (ms: number) => `${(ms / span) * 100}%`;

  return (
    <Section
      id="requests"
      title="Requests"
      note="When each file started and finished loading. These timings come from the actual page load, without throttling, so they run shorter than the lab metrics."
      aside={total > requests.length ? `First ${requests.length} of ${total} requests` : `${total} requests`}
    >
      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-label="Legend">
        {kinds.map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: kindMeta[k].color }} />
            {kindMeta[k].label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="rounded border border-line-strong px-1 text-[10px] leading-4">3P</span>
          Third-party host
        </li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-[15rem_1fr_4.5rem]">
        {/* axis */}
        <div className="hidden md:block" />
        <div className="relative hidden h-6 border-b border-line md:block" aria-hidden="true">
          {ticks.map((t, i) => (
            <span
              key={t}
              className={`num absolute bottom-1.5 whitespace-nowrap text-[11px] text-faint ${
                i === 0 ? "" : t / span > 0.9 ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              style={{ left: pct(t) }}
            >
              {t === 0 ? "0" : t >= 1000 ? `${t / 1000} s` : `${t} ms`}
            </span>
          ))}
        </div>
        <div className="hidden md:block" />

        {requests.map((r, i) => (
          <div key={`${r.url}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-3 pt-3 md:contents">
            <div className="flex min-w-0 items-center gap-2 text-sm md:py-1.5 md:pr-4">
              <span className="truncate" title={r.url}>
                {r.name}
              </span>
              {!r.firstParty && (
                <span className="shrink-0 rounded border border-line-strong px-1 text-[10px] leading-4 text-muted" title={r.host}>
                  3P
                </span>
              )}
            </div>
            <div className="relative col-span-2 row-start-2 h-5 md:col-span-1 md:row-start-auto md:h-auto">
              {ticks.map((t) => (
                <span key={t} className="absolute inset-y-0 hidden w-px bg-line md:block" style={{ left: pct(t) }} aria-hidden="true" />
              ))}
              <span
                className="bar-in absolute top-1/2 h-2.5 -translate-y-1/2 rounded-sm"
                style={{
                  left: pct(r.start),
                  width: `max(3px, ${pct(r.end - r.start)})`,
                  background: kindMeta[r.kind].color,
                  animationDelay: `${Math.min(i * 15, 400)}ms`,
                }}
              />
            </div>
            <div className="num col-start-2 row-start-1 self-center text-right text-xs text-faint md:col-start-auto md:row-start-auto">
              {r.transferBytes > 0 ? formatBytes(r.transferBytes) : "–"}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
