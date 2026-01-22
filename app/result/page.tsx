"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";
import { AnalysisResult } from "../types";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCalled = useRef(false);

  useEffect(() => {
    if (!url) {
        router.push("/");
        return;
    }

    if (analyzeCalled.current) return;
    analyzeCalled.current = true;

    const analyze = async () => {
        try {
            const res = await fetch('/api/analyze', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }) 
            });
            
            if (!res.ok) throw new Error('Analysis failed');
            
            const newResult = await res.json();
            setResult(newResult);
            
            const saved = localStorage.getItem("fpo_history");
            let history: AnalysisResult[] = [];
            if (saved) {
                try {
                    history = JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse history", e);
                }
            }
            const newHistory = [newResult, ...history.filter((h: AnalysisResult) => h.url !== url)].slice(0, 4);
            localStorage.setItem("fpo_history", JSON.stringify(newHistory));

        } catch (err) {
            console.error(err);
            setError("Failed to analyze the URL. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    analyze();
  }, [url, router]);

  const handleBack = () => {
      router.push("/");
  };

  if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative w-16 h-16">
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-muted-foreground animate-pulse">Analyzing {url}...</p>
        </div>
      );
  }

  if (error || !result) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <h3 className="text-xl font-bold">Analysis Failed</h3>
              <p className="text-muted-foreground">{error || "Something went wrong"}</p>
              <button onClick={handleBack} className="mt-4 px-6 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium transition-colors">
                  Go Back
              </button>
          </div>
      )
  }

  return (
    <div className="py-8">
        <Dashboard result={result} onBack={handleBack} />
    </div>
  );
}

export default function ResultPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-indigo-500/30">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col relative z-10">
                <Suspense fallback={<div>Loading...</div>}>
                    <ResultContent />
                </Suspense>
            </main>
        </div>
    )
}
