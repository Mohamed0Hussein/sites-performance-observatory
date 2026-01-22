"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { AnalysisResult } from "./types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("fpo_history");
    if (saved) {
        try {
            setHistory(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }
  }, []);

  const handleAnalyze = (url: string) => {
    setLoading(true);
    router.push(`/result?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-indigo-500/30 relative">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
             <div 
                className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/0 rounded-full blur-[100px] animate-pulse"
                style={{ 
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
                }} 
              />
          </div>
      </div>
      
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col relative z-10">
           <div className="flex-1 flex flex-col justify-center items-center gap-12">
                <Hero onAnalyze={handleAnalyze} loading={loading} />
                
                {history.length > 0 && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wider">Recent Analyses</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {history.map((item, i) => (
                                <button 
                                    key={i}
                                    onClick={() => router.push(`/result?url=${encodeURIComponent(item.url)}`)}
                                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-white/5 transition-all text-left group"
                                >
                                    <div className="overflow-hidden">
                                        <div className="font-medium truncate text-sm">{item.url.replace(/^https?:\/\//, '')}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</div>
                                    </div>
                                    <div className={`text-lg font-bold ${item.performanceScore >= 90 ? 'text-emerald-500' : item.performanceScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {item.performanceScore}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
           </div>
      </main>
      
       <footer className="w-full py-8 border-t border-white/5 text-center text-sm text-muted-foreground bg-background/50 backdrop-blur-md">
            <p>© {new Date().getFullYear()} Frontend Performance Observatory. Built for speed.</p>
       </footer>
    </div>
  );
}
