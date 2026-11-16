import type { ResourceKind } from "@/lib/report";

export const kindMeta: Record<ResourceKind, { label: string; color: string }> = {
  document: { label: "HTML", color: "var(--k-document)" },
  script: { label: "JavaScript", color: "var(--k-script)" },
  stylesheet: { label: "CSS", color: "var(--k-stylesheet)" },
  image: { label: "Images", color: "var(--k-image)" },
  font: { label: "Fonts", color: "var(--k-font)" },
  media: { label: "Media", color: "var(--k-other)" },
  fetch: { label: "Data requests", color: "var(--k-fetch)" },
  other: { label: "Other", color: "var(--k-other)" },
};

export function kindColor(kind: string): string {
  return (kindMeta as Record<string, { color: string }>)[kind]?.color ?? "var(--k-other)";
}
