import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frontend Performance Observatory",
  description: "Deep dive into your Web Vitals and performance metrics. Analyze LCP, CLS, FID, and bundle sizes instantly.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Frontend Performance Observatory",
    description: "Deep dive into your Web Vitals and performance metrics.",
    url: "https://frontend-performance-observatory.vercel.app",
    siteName: "Frontend Performance Observatory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Performance Observatory",
    description: "Deep dive into your Web Vitals and performance metrics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
