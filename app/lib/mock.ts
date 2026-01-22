import { AnalysisResult, Metric, BundleAsset, WaterfallEvent } from "../types";

export const generateMockResult = (url: string): AnalysisResult => {
    return {
        url,
        timestamp: new Date().toISOString(),
        performanceScore: Math.floor(Math.random() * (100 - 70) + 70), 
        metrics: {
            lcp: {
                name: "Largest Contentful Paint",
                value: 2.4,
                displayValue: "2.4s",
                unit: "s",
                score: 85,
                label: "Good",
                description: "Time it takes for the largest visible element to load."
            },
            cls: {
                name: "Cumulative Layout Shift",
                value: 0.05,
                displayValue: "0.05",
                unit: "",
                score: 92,
                label: "Good",
                description: "Visual stability of the page."
            },
            fid: {
                name: "First Input Delay",
                value: 45,
                displayValue: "45ms",
                unit: "ms",
                score: 98,
                label: "Good",
                description: "Time from first interaction to browser response."
            },
            inp: {
                name: "Interaction to Next Paint",
                value: 120,
                displayValue: "120ms",
                unit: "ms",
                score: 80,
                label: "Needs Improvement",
                description: "Responsiveness to user interactions."
            },
            fcp: {
                name: "First Contentful Paint",
                value: 1.2,
                displayValue: "1.2s",
                unit: "s",
                score: 95,
                label: "Good",
                description: "Time until the first text or image is painted."
            },
            ttfb: {
                name: "Time to First Byte",
                value: 0.8,
                displayValue: "0.8s",
                unit: "s",
                score: 70,
                label: "Needs Improvement",
                description: "Server response time."
            }
        },
        bundleSize: 1540,
        assets: [
            { name: "main.js", size: 450, type: "js" },
            { name: "styles.css", size: 120, type: "css" },
            { name: "hero-image.jpg", size: 800, type: "image" },
            { name: "framework.js", size: 150, type: "js" },
            { name: "analytics.js", size: 20, type: "js" },
        ],
        waterfall: [
            { name: "DNS Lookup", startTime: 0, duration: 50, type: "network" },
            { name: "TCP Connect", startTime: 50, duration: 30, type: "network" },
            { name: "SSL Handshake", startTime: 80, duration: 40, type: "network" },
            { name: "HTML Request", startTime: 120, duration: 150, type: "network" },
            { name: "Parse HTML", startTime: 270, duration: 40, type: "script" },
            { name: "CSS Download", startTime: 310, duration: 80, type: "network" },
            { name: "JS Download", startTime: 310, duration: 200, type: "network" },
            { name: "Layout & Paint", startTime: 510, duration: 100, type: "render" },
        ],
        suggestions: [
            "Reduce bundle size by splitting large chunks.",
            "Optimize hero image (use WebP format).",
            "Eliminate render-blocking resources.",
            "Preload key requests."
        ]
    };
};
