import Link from "next/link";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { RecentAnalyses } from "@/components/RecentAnalyses";

export default function Home() {
  return (
    <div className="max-w-3xl pb-24 pt-16 sm:pt-28">
      <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-6xl">
        See how fast a page loads for the people using it.
      </h1>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
        Paste a URL to get its Core Web Vitals from real Chrome users, a Lighthouse lab test, every request on a
        timeline, and the fixes with the biggest estimated savings.
      </p>

      <div className="mt-10">
        <AnalyzeForm />
        <p className="mt-3 text-sm text-faint">
          A test takes about 20 seconds.{" "}
          <Link href="/result?sample=1" className="text-muted underline decoration-line-strong underline-offset-4 hover:text-fg">
            See a sample report
          </Link>{" "}
          first if you&apos;re curious.
        </p>
      </div>

      <RecentAnalyses />
    </div>
  );
}
