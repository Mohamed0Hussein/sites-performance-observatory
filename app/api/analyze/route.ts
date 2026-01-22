import { NextResponse } from 'next/server';
import { AnalysisResult, Metric, BundleAsset, WaterfallEvent } from '../../types';
import { generateMockResult } from '../../lib/mock';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PSI_API_KEY;
    const strategy = 'mobile';
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;

    try {
        const res = await fetch(psiUrl);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.warn("PSI API Error (falling back to simulation):", res.status, errorText);
            throw new Error(`PageSpeed Insights API failed: ${res.statusText}`);
        }

        const data = await res.json();
        const lh = data.lighthouseResult;
        const audits = lh.audits;

        
        const mapMetric = (auditId: string, name: string, description: string, isCLS: boolean = false): Metric => {
            const audit = audits[auditId];
            if (!audit) {
                return {
                    name,
                    value: 0,
                    displayValue: "N/A",
                    unit: "",
                    score: 0,
                    label: "Needs Improvement",
                    description
                };
            }
            
            
            const rawScore = audit.score;
            const score = rawScore !== null && rawScore !== undefined ? rawScore : 0;
            
            
            const value = audit.numericValue ?? 0;
            
            
            let displayValue = audit.displayValue;
            if (!displayValue || displayValue === '') {
                if (isCLS) {
                    
                    displayValue = value.toFixed(3);
                } else {
                    
                    const unit = audit.numericUnit || 'ms';
                    if (unit === 'millisecond' && value >= 1000) {
                        displayValue = `${(value / 1000).toFixed(1)} s`;
                    } else {
                        displayValue = `${Math.round(value)} ${unit === 'millisecond' ? 'ms' : unit}`;
                    }
                }
            }
            
            
            let label: "Good" | "Needs Improvement" | "Poor";
            if (score >= 0.9) {
                label = "Good";
            } else if (score >= 0.5) {
                label = "Needs Improvement";
            } else {
                label = "Poor";
            }
            
            return {
                name,
                value,
                displayValue,
                unit: isCLS ? "" : (audit.numericUnit || "ms"),
                score: Math.round(score * 100),
                label,
                description
            };
        };

        
        const getFieldMetric = (metricId: string, name: string, description: string, fallbackMetric?: Metric, isCLS: boolean = false): Metric => {
            const fieldMetric = data.loadingExperience?.metrics?.[metricId];
            if (fieldMetric && fieldMetric.percentile !== undefined && fieldMetric.percentile !== null) {
                const value = fieldMetric.percentile;
                let score = 0;
                let label: "Good" | "Needs Improvement" | "Poor" = "Poor";
                
                
                const category = fieldMetric.category?.toUpperCase();
                if (category === "FAST" || category === "GOOD") {
                    score = 100;
                    label = "Good";
                } else if (category === "AVERAGE") {
                    score = 75;
                    label = "Needs Improvement";
                } else if (category === "SLOW") {
                    score = 25;
                    label = "Poor";
                }

                
                let displayValue: string;
                if (isCLS) {
                    
                    displayValue = (value / 100).toFixed(2);
                } else if (value >= 1000) {
                    displayValue = `${(value / 1000).toFixed(1)} s`;
                } else {
                    displayValue = `${value} ms`;
                }

                return {
                    name: `${name} (Field)`,
                    value,
                    displayValue,
                    unit: isCLS ? "" : "ms",
                    score,
                    label,
                    description
                };
            }
            return fallbackMetric || {
                name,
                value: 0,
                displayValue: "N/A",
                unit: "",
                score: 0,
                label: "Needs Improvement",
                description
            };
        };

        
        const metrics = {
            
            lcp: getFieldMetric('LARGEST_CONTENTFUL_PAINT_MS', 'Largest Contentful Paint', 'Time it takes for the largest visible element to load.',
                 mapMetric('largest-contentful-paint', 'Largest Contentful Paint', 'Time it takes for the largest visible element to load.')),
            
            cls: getFieldMetric('CUMULATIVE_LAYOUT_SHIFT_SCORE', 'Cumulative Layout Shift', 'Visual stability of the page.',
                 mapMetric('cumulative-layout-shift', 'Cumulative Layout Shift', 'Visual stability of the page.', true), true),
            
            fid: getFieldMetric('FIRST_INPUT_DELAY_MS', 'First Input Delay', 'Input latency.', 
                 mapMetric('total-blocking-time', 'Total Blocking Time (Lab)', 'Proxy for FID in lab tests.')),
            
            inp: getFieldMetric('INTERACTION_TO_NEXT_PAINT', 'Interaction to Next Paint', 'Responsiveness.', 
                 mapMetric('total-blocking-time', 'Total Blocking Time (Lab)', 'Proxy for responsiveness in lab tests.')),
            
            fcp: getFieldMetric('FIRST_CONTENTFUL_PAINT_MS', 'First Contentful Paint', 'Time until the first text or image is painted.',
                 mapMetric('first-contentful-paint', 'First Contentful Paint', 'Time until the first text or image is painted.')),
            
            ttfb: getFieldMetric('EXPERIMENTAL_TIME_TO_FIRST_BYTE', 'Time to First Byte', 'Server response time.',
                 mapMetric('server-response-time', 'Time to First Byte', 'Server response time.'))
        };

        
        const resourceItems = audits['resource-summary']?.details?.items || [];
        const assets: BundleAsset[] = resourceItems
            .filter((item: any) => item.resourceType !== 'total' && item.transferSize > 0)
            .map((item: any) => ({
                name: item.label || item.resourceType || 'Unknown',
                size: Math.round((item.transferSize || 0) / 1024), 
                type: mapResourceType(item.resourceType)
            }))
            .filter((asset: BundleAsset) => asset.size > 0) 
            .slice(0, 5); 
        
        
        const bundleSize = assets
            .filter(a => a.type === 'js' || a.type === 'css')
            .reduce((acc, curr) => acc + curr.size, 0);

        
        const networkItems = audits['network-requests']?.details?.items || [];
        const waterfall: WaterfallEvent[] = networkItems
            .filter((req: any) => req.url && req.startTime !== undefined)
            .slice(0, 10)
            .map((req: any) => {
                const start = req.startTime || 0;
                const end = req.endTime || start;
                
                let duration = 0;
                if (req.transferSize && req.transferSize > 0) {
                    duration = end > start ? Math.round(end - start) : Math.round(req.transferSize / 100); 
                } else if (end > start) {
                    duration = Math.round(end - start);
                }
                
                
                let name = 'resource';
                try {
                    const urlPath = new URL(req.url).pathname;
                    name = urlPath.split('/').pop()?.split('?')[0] || urlPath.split('/').filter(Boolean).pop() || 'resource';
                } catch {
                    name = req.url.split('/').pop()?.split('?')[0] || 'resource';
                }
                
                return {
                    name: name.length > 20 ? name.substring(0, 17) + '...' : name,
                    startTime: Math.round(start),
                    duration: Math.max(duration, 1), 
                    type: req.resourceType === 'Script' ? 'script' : req.resourceType === 'Image' ? 'render' : 'network'
                };
            });

        
        const suggestions = Object.values(audits)
            .filter((audit: any) => audit.score !== null && audit.score < 0.9 && audit.details)
            .sort((a: any, b: any) => (a.score || 0) - (b.score || 0)) 
            .slice(0, 4)
            .map((audit: any) => audit.title);

        const result: AnalysisResult = {
            url: url,
            timestamp: new Date().toISOString(),
            performanceScore: Math.round((lh.categories.performance?.score ?? 0) * 100), 
            metrics,
            bundleSize,
            assets,
            waterfall,
            suggestions
        };

        return NextResponse.json(result);

    } catch (apiError) {
        
        console.log("Falling back to simulation mode due to API error.", apiError);
        
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return NextResponse.json(generateMockResult(url));
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function mapResourceType(type: string): "js" | "css" | "image" | "font" | "other" {
    const t = type.toLowerCase();
    if (t.includes('script') || t.includes('javascript')) return 'js';
    if (t.includes('css') || t.includes('stylesheet')) return 'css';
    if (t.includes('image')) return 'image';
    if (t.includes('font')) return 'font';
    return 'other';
}
