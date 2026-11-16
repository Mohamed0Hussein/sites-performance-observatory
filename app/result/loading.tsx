import { Suspense } from "react";
import { TestProgress } from "@/components/TestProgress";

export default function Loading() {
  return (
    <div className="pb-16 pt-8">
      <Suspense fallback={<h1 className="mt-14 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Preparing report</h1>}>
        <TestProgress />
      </Suspense>
      <div className="mt-10 grid gap-8 border-y border-line py-8 md:grid-cols-2" aria-hidden="true">
        <div className="flex items-center gap-6">
          <div className="skeleton h-28 w-28 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-4 w-56" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-8 w-36" />
          <div className="skeleton h-4 w-64" />
        </div>
      </div>
      <div className="mt-10 space-y-6" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid gap-6 md:grid-cols-[15rem_12rem_1fr]">
            <div className="skeleton h-5" />
            <div className="skeleton h-7" />
            <div className="skeleton h-2 self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}
