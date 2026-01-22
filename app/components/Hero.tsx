"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useState } from "react";
import { motion } from "framer-motion";

export function Hero({ onAnalyze, loading }: { onAnalyze: (url: string) => void, loading: boolean }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onAnalyze(url);
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center space-y-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 max-w-4xl relative z-10"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white">
          Make your web <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">blazing fast</span>.
        </h1>
        <p className="max-w-2xl mx-auto leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Deep dive into your Web Vitals. Uncover rendering bottlenecks, analyze bundle sizes, and optimize for the user experience.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="flex w-full max-w-lg items-center space-x-2 relative z-10"
      >
        <div className="relative w-full"> 
            <Input 
              type="url" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 px-4 rounded-full bg-secondary/50 border-white/10 backdrop-blur-sm transition-all focus:ring-2 ring-primary/50 text-base"
              required
            />
        </div>
        <Button size="lg" className="rounded-full px-8 h-12 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-shadow duration-300" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.form>
      

    </section>
  );
}
