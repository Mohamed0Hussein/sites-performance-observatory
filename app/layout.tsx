import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const description =
  "Run Google PageSpeed Insights on any page and see real-user Core Web Vitals next to a Lighthouse lab test, the request waterfall, and the fixes with the biggest estimated savings.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: { default: "Performance Observatory", template: "%s — Performance Observatory" },
  description,
  openGraph: { title: "Performance Observatory", description, type: "website", siteName: "Performance Observatory" },
  twitter: { card: "summary_large_image", title: "Performance Observatory", description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0e" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-fg antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-5 py-8 text-sm text-faint sm:px-8">
          Data from{" "}
          <a
            className="underline decoration-line-strong underline-offset-4 hover:text-fg"
            href="https://developers.google.com/speed/docs/insights/v5/about"
          >
            PageSpeed Insights
          </a>
          : the Chrome UX Report for real users, and Lighthouse for the lab test.
        </footer>
      </body>
    </html>
  );
}
