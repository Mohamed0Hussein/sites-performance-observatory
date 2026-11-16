import type { LabMetric } from "@/lib/report";
import { RatingMark } from "../RatingMark";
import { Section } from "./Section";

export function LabSection({ lab, strategy }: { lab: LabMetric[]; strategy: string }) {
  if (lab.length === 0) return null;
  return (
    <Section
      id="lab"
      title="Lab test"
      note={`One ${strategy} page load in Lighthouse with simulated throttling. Use it to debug; real users above are what count.`}
    >
      <div>
        <table className="w-full text-left">
          <thead className="text-sm text-faint">
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4 font-normal">Metric</th>
              <th scope="col" className="py-2 pr-4 font-normal">Value</th>
              <th scope="col" className="py-2 pr-4 font-normal">Score</th>
              <th scope="col" className="hidden py-2 font-normal sm:table-cell">Share of total score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lab.map((m) => (
              <tr key={m.id}>
                <th scope="row" className="py-4 pr-4 font-normal">
                  <span className="hidden sm:inline">{m.name} </span>
                  <abbr title={m.name} className="no-underline sm:text-faint">{m.id}</abbr>
                </th>
                <td className="num py-4 pr-4 text-lg">{m.display}</td>
                <td className="py-4 pr-4">
                  <span className="inline-flex items-center gap-2">
                    <RatingMark rating={m.rating} />
                    <span className="num">{m.score}</span>
                  </span>
                </td>
                <td className="hidden py-4 sm:table-cell">
                  <span className="flex items-center gap-3">
                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-line" aria-hidden="true">
                      <span className="bar-in block h-full bg-fg" style={{ width: `${m.weight}%` }} />
                    </span>
                    <span className="num text-sm text-muted">{m.weight}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
