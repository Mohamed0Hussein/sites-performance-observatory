"use client";

import { AnalysisResult } from "../types";
import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

export function Dashboard({ result, onBack }: { result: AnalysisResult, onBack: () => void }) {
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 border-emerald-500";
    if (score >= 50) return "text-amber-500 border-amber-500";
    return "text-rose-500 border-rose-500";
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
                <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors flex items-center gap-1">
                    ← Analyze another URL
                </button>
                <h2 className="text-3xl font-bold tracking-tight text-white">Analysis Results</h2>
                <p className="text-muted-foreground mt-1 font-mono text-sm">{result.url}</p>
            </div>
            
            <div className={`relative flex items-center justify-center h-32 w-32 rounded-full border-8 bg-background shadow-2xl ${getScoreColor(result.performanceScore).replace("text", "border").split(" ")[1]}`}>
                 <div className="flex flex-col items-center">
                    <span className={`text-4xl font-black ${getScoreColor(result.performanceScore).split(' ')[0]}`}>{result.performanceScore}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Score</span>
                 </div>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <MetricCard metric={result.metrics.lcp} />
             <MetricCard metric={result.metrics.cls} />
             <MetricCard metric={result.metrics.fid} />
             <MetricCard metric={result.metrics.inp} />
             <MetricCard metric={result.metrics.fcp} />
             <MetricCard metric={result.metrics.ttfb} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 bg-white/5 border-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Bundle Composition</CardTitle>
                    <CardDescription>Breakdown of resource sizes (KB)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.assets} layout="vertical" margin={{ left: 30, right: 30 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9ca3af', fontSize: 11}} tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }} 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                itemStyle={{color: '#fff'}}
                            />
                            <Bar dataKey="size" radius={[0, 4, 4, 0]} barSize={20}>
                                {result.assets.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.type === 'js' ? '#818cf8' : entry.type === 'css' ? '#34d399' : '#f472b6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            <Card className="col-span-1 bg-white/5 border-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Request Waterfall</CardTitle>
                    <CardDescription>Visualize loading sequence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.waterfall.map((item, i) => (
                        <div key={i} className="flex items-center text-xs group">
                            <div className="w-24 truncate text-muted-foreground mr-3 font-medium" title={item.name}>{item.name}</div>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
                                <motion.div 
                                    className={`absolute h-full rounded-full ${item.type === 'network' ? 'bg-indigo-500' : item.type === 'render' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    initial={{ width: 0, left: `${(item.startTime / 650) * 100}%` }}
                                    animate={{ width: Math.max(((item.duration / 650) * 100), 2) + '%' }} 
                                    transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                                />
                            </div>
                            <div className="w-12 text-right text-muted-foreground ml-3 tabular-nums group-hover:text-white transition-colors">{item.duration}ms</div>
                        </div>
                    ))}
                    <div className="flex justify-start gap-4 text-xs text-muted-foreground pt-4 border-t border-white/5 mt-4">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"/> Network</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Render</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"/> Script</div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
         <Card className="bg-linear-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Optimization Suggestions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold ring-1 ring-inset ring-indigo-500/50 mt-0.5">
                                {i + 1}
                            </span>
                            <span className="text-muted-foreground">{s}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
