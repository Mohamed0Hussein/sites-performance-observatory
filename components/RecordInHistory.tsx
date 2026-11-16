"use client";

import { useEffect } from "react";
import { addToHistory } from "@/lib/history";
import type { Strategy } from "@/lib/report";

export function RecordInHistory({ url, strategy, score }: { url: string; strategy: Strategy; score: number | null }) {
  useEffect(() => {
    addToHistory({ url, strategy, score, at: new Date().toISOString() });
  }, [url, strategy, score]);
  return null;
}
