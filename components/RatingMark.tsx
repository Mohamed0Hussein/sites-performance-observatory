import type { Rating } from "@/lib/report";
import { ratingLabel } from "@/lib/thresholds";

/**
 * Lighthouse's convention: circle for good, square for needs improvement, triangle for poor.
 * Shape carries the meaning too, so the rating is readable without color.
 */
export function RatingMark({ rating, labelled = false }: { rating: Rating; labelled?: boolean }) {
  const color = rating === "good" ? "var(--good)" : rating === "needs-improvement" ? "var(--ni)" : "var(--poor)";
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0" role={labelled ? undefined : "img"} aria-label={labelled ? undefined : ratingLabel[rating]}>
        {rating === "good" && <circle cx="5" cy="5" r="5" fill={color} />}
        {rating === "needs-improvement" && <rect width="10" height="10" fill={color} />}
        {rating === "poor" && <path d="M5 0l5 10H0z" fill={color} />}
      </svg>
      {labelled && <span style={{ color }}>{ratingLabel[rating]}</span>}
    </span>
  );
}
