/**
 * Turns what someone typed ("example.com", "https://example.com/pricing") into an absolute
 * http(s) URL, or returns null if it can't be one. PageSpeed Insights only tests public pages,
 * so local and private addresses are rejected up front with a clear message instead of a slow failure.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname;
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".localhost")) return null;
  if (/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return null;
  url.hash = "";
  return url.toString();
}

export function parseStrategy(value: string | string[] | undefined): "mobile" | "desktop" {
  return value === "desktop" ? "desktop" : "mobile";
}
