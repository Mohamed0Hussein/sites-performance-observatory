import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Result pages are per-URL and change every run, so only the home page is worth indexing
  return { rules: { userAgent: "*", allow: "/", disallow: ["/result", "/api/"] } };
}
