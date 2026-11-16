# Performance Observatory

Run Google PageSpeed Insights on any page and read the result as a report: real-user Core Web Vitals next to a Lighthouse lab test, the fixes with the biggest estimated savings, every request on a timeline, and page weight by type.

Live site: https://sites-peformance-observatory.vercel.app/

Sample report: https://sites-peformance-observatory.vercel.app/result?sample=1

## What's in a report

- **Core Web Vitals assessment.** Pass or fail, worked out the way Google does: LCP, INP and CLS must all be good at the 75th percentile.
- **Real users.** 28 days of Chrome UX Report data, with the good / needs improvement / poor split for each metric. If the page has too little traffic, the report says it fell back to whole-site data, or that there's no data at all.
- **Lab test.** The five Lighthouse metrics, each with its score and its weight in the overall performance score.
- **What to fix first.** Failing Lighthouse audits that have an estimated saving, sorted by time saved, then bytes, then layout shift.
- **Requests.** A waterfall of the first 40 requests, with third-party hosts marked.
- **Page weight.** Transferred bytes by resource type.

Results are cached for five minutes per URL and device. "Run again" skips the cache.

## Running it

```bash
npm install
cp .env.example .env.local   # then add your key
npm run dev
```

You need a PageSpeed Insights API key. Google no longer serves keyless requests. Get a key from [Google Cloud](https://developers.google.com/speed/docs/insights/v5/get-started#APIKey) and set `PSI_API_KEY`.

Without a key, `/result?sample=1` still works. It renders a made-up response for a fictional store through the same parser, and it's labelled as sample data on the page.

## JSON API

```
GET /api/analyze?url=example.com&strategy=mobile
```

This returns the same `Report` object the page renders (see `lib/report.ts`). Errors come back as `{ error: { code, message } }` with a matching status code: 400 for an invalid URL, 422 when the page can't be loaded, 429 when the quota is used up, 503 when no key is configured.

## How it's built

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. There are no chart or animation libraries; the charts are plain HTML and SVG.

```
app/
  page.tsx               home: URL form and recent tests
  result/page.tsx        server-rendered report; loading.tsx shows elapsed time
  api/analyze/route.ts   JSON endpoint
lib/
  psi/fetch.ts           calls PageSpeed Insights, turns its errors into typed ReportErrors
  psi/parse.ts           raw PSI response -> Report
  psi/sample.json        sample response for /result?sample=1
  report.ts              Report types
  thresholds.ts          Web Vitals thresholds and Lighthouse score bands
components/report/       one component per report section
```

The report page fetches on the server, so a result URL can be shared and nothing slow runs in the browser. Recent tests are kept in `localStorage` on the visitor's device.
