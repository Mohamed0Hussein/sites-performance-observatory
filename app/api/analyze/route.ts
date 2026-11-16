import { NextResponse } from "next/server";
import { fetchReport } from "@/lib/psi/fetch";
import { ReportError } from "@/lib/report";
import { normalizeUrl, parseStrategy } from "@/lib/url";

export const maxDuration = 60;

const STATUS: Record<ReportError["code"], number> = {
  "missing-key": 503,
  quota: 429,
  "invalid-url": 400,
  unreachable: 422,
  timeout: 504,
  upstream: 502,
};

/** JSON version of the report: GET /api/analyze?url=example.com&strategy=mobile */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = normalizeUrl(searchParams.get("url") ?? "");
  if (!url) {
    return NextResponse.json({ error: { code: "invalid-url", message: "Pass a public http(s) URL as ?url=" } }, { status: 400 });
  }
  try {
    const report = await fetchReport(url, parseStrategy(searchParams.get("strategy") ?? undefined));
    return NextResponse.json(report, { headers: { "Cache-Control": "public, s-maxage=300" } });
  } catch (err) {
    const e = err instanceof ReportError ? err : new ReportError("upstream", "Unexpected error.");
    return NextResponse.json({ error: { code: e.code, message: e.message } }, { status: STATUS[e.code] });
  }
}
