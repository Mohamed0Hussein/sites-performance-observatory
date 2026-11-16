"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { normalizeUrl } from "@/lib/url";
import type { Strategy } from "@/lib/report";
import { cn } from "@/lib/format";

export function AnalyzeForm({
  defaultUrl = "",
  defaultStrategy = "mobile",
  compact = false,
}: {
  defaultUrl?: string;
  defaultStrategy?: Strategy;
  compact?: boolean;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(defaultUrl);
  const [strategy, setStrategy] = useState<Strategy>(defaultStrategy);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputId = useId();
  const errorId = useId();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Enter a public web address, like example.com or https://example.com/pricing.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({ url: normalized, strategy });
    startTransition(() => router.push(`/result?${params}`));
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label htmlFor={inputId} className={compact ? "sr-only" : "mb-2 block text-sm text-muted"}>
        Page to test
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-md border bg-bg px-4 text-base outline-none transition-colors placeholder:text-faint focus:border-fg",
            error ? "border-poor" : "border-line-strong",
          )}
        />

        <fieldset className="flex h-12 shrink-0 rounded-md border border-line-strong p-1">
          <legend className="sr-only">Device</legend>
          {(["mobile", "desktop"] as const).map((s) => (
            <label
              key={s}
              className={cn(
                "flex cursor-pointer items-center rounded px-3.5 text-sm capitalize transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fg",
                strategy === s ? "bg-fg text-bg" : "text-muted hover:text-fg",
              )}
            >
              <input
                type="radio"
                name="strategy"
                value={s}
                checked={strategy === s}
                onChange={() => setStrategy(s)}
                className="sr-only"
              />
              {s}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={pending}
          className="h-12 shrink-0 rounded-md bg-fg px-6 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {pending ? "Starting…" : "Analyze"}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-poor">
          {error}
        </p>
      )}
    </form>
  );
}
