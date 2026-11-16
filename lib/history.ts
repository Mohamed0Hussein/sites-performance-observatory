"use client";

import { useSyncExternalStore } from "react";
import type { Strategy } from "./report";

export interface HistoryEntry {
  url: string;
  strategy: Strategy;
  score: number | null;
  at: string;
}

const KEY = "observatory:history:v2";
const LIMIT = 6;
const EMPTY: HistoryEntry[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: HistoryEntry[] } = { raw: null, value: EMPTY };

function read(): HistoryEntry[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.value;
  let value = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed.filter((e): e is HistoryEntry => typeof e?.url === "string");
  } catch {
    /* corrupted entry: start over */
  }
  cache = { raw, value };
  return value;
}

export function addToHistory(entry: HistoryEntry) {
  const next = [entry, ...read().filter((e) => !(e.url === entry.url && e.strategy === entry.strategy))].slice(0, LIMIT);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return;
  }
  listeners.forEach((l) => l());
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    return;
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useHistory(): HistoryEntry[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
