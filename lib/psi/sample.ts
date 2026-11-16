import type { Report, Strategy } from "../report";
import { parsePsi } from "./parse";
import type { PsiResponse } from "./raw";
import sample from "./sample.json";

/**
 * A made-up PageSpeed Insights response for a fictional store, shaped like the real API.
 * It runs through the same parser as live data and is always labelled as a sample in the UI.
 */
export function sampleReport(strategy: Strategy = "mobile"): Report {
  return parsePsi(sample as PsiResponse, "https://shop.example.com/", strategy, true);
}
