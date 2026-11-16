import type { Report } from "@/lib/report";
import { formatBytes, formatPercent } from "@/lib/format";
import { kindColor } from "./kinds";
import { Section } from "./Section";

export function PageWeight({ weight }: { weight: Report["weight"] }) {
  const rows = weight.rows.filter((r) => r.bytes > 0);
  if (rows.length === 0) return null;
  const totalBytes = weight.total?.bytes ?? rows.reduce((s, r) => s + r.bytes, 0);
  const totalRequests = weight.total?.requests ?? rows.reduce((s, r) => s + r.requests, 0);

  return (
    <Section
      id="weight"
      title="Page weight"
      note="Bytes transferred over the network, by type. Compressed sizes, so this is what users actually download."
      aside={
        <span>
          <span className="num text-fg">{formatBytes(totalBytes)}</span> in{" "}
          <span className="num text-fg">{totalRequests}</span> requests
        </span>
      }
    >
      <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-line" aria-hidden="true">
        {rows.map((r) => (
          <span key={r.kind} className="bar-in h-full" style={{ width: `${(r.bytes / totalBytes) * 100}%`, background: kindColor(r.kind) }} />
        ))}
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-faint">
          <tr className="border-b border-line">
            <th scope="col" className="py-2 font-normal">Type</th>
            <th scope="col" className="py-2 text-right font-normal">Requests</th>
            <th scope="col" className="py-2 text-right font-normal">Size</th>
            <th scope="col" className="py-2 text-right font-normal">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.kind}>
              <th scope="row" className="py-3 font-normal">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: kindColor(r.kind) }} aria-hidden="true" />
                  {r.label}
                </span>
              </th>
              <td className="num py-3 text-right">{r.requests}</td>
              <td className="num py-3 text-right">{formatBytes(r.bytes)}</td>
              <td className="num py-3 text-right text-muted">{formatPercent(r.bytes / totalBytes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
