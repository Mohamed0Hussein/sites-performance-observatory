export function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return "–";
  if (ms >= 1000) return `${(ms / 1000).toFixed(ms >= 10_000 ? 0 : 1)} s`;
  return `${Math.round(ms)} ms`;
}

export function formatCls(value: number): string {
  return value.toFixed(value === 0 ? 0 : 2);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kib = bytes / 1024;
  if (kib < 1024) return `${kib < 10 ? kib.toFixed(1) : Math.round(kib)} KB`;
  return `${(kib / 1024).toFixed(1)} MB`;
}

export function formatPercent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function displayHost(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname;
    return `${u.host.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
