import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Metric } from "../types";
import { cn } from "../lib/utils";

export function MetricCard({ metric }: { metric: Metric }) {
  const getColor = (label: string) => {
    switch (label) {
      case "Good": return "text-emerald-500 ring-emerald-500/20 bg-emerald-500/10";
      case "Needs Improvement": return "text-amber-500 ring-amber-500/20 bg-amber-500/10";
      case "Poor": return "text-rose-500 ring-rose-500/20 bg-rose-500/10";
      default: return "text-gray-500";
    }
  };
  
  const getBorderColor = (label: string) => {
      switch(label) {
          case "Good": return "border-l-emerald-500";
          case "Needs Improvement": return "border-l-amber-500";
          case "Poor": return "border-l-rose-500";
          default: return "border-l-transparent";
      }
  }

  return (
    <Card className={cn("relative overflow-hidden border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10 border-l-4", getBorderColor(metric.label))}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2 text-foreground">{metric.displayValue}</div>
        <div className={cn("text-xs inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset", getColor(metric.label))}>
            {metric.label}
        </div>
        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{metric.description}</p>
      </CardContent>
      
       <div className="absolute -right-6 -top-6 h-24 w-24 opacity-5 rounded-full border-12 border-current" style={{ color: "currentColor" }} />
    </Card>
  );
}
