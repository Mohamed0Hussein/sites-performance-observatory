# ⚡ Frontend Performance Observatory

**live link** : https://sites-peformance-observatory.vercel.app/

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Framework](https://img.shields.io/badge/Next.js-15-black)
![Styling](https://img.shields.io/badge/Tailwind_CSS-v4-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A premium, production-grade dashboard designed to analyze, visualize, and optimize frontend performance. Built for engineers who care about Web Vitals, rendering metrics, and user experience signals.

---

## 🚀 Overview

**Frontend Performance Observatory** is more than just a speed test—it's a deep-dive diagnostic tool. It moves beyond simple scores to provide visual watermills, bundle composition breakdowns, and actionable insights to improve LCP, CLS, and FID.

Designed with a **"Premium First"** philosophy, the UI features glassmorphism, smooth micro-interactions (Framer Motion), and a sophisticated dark mode aesthetic that feels alive.

## ✨ Key Features

### 📊 Deep Performance Analysis
- **Core Web Vitals**: Instant analysis of LCP, CLS, FID, INP, FCP, and TTFB.
- **Smart Scoring**: Visual grading system (Good/Needs Improvement/Poor) for immediate feedback.
- **Mock Simulation**: Currently runs in a high-fidelity simulation mode for instant demos without API keys.

### 🌊 Visual Waterfall Timeline
- **Request Sequencing**: Visualize how your resources load in real-time.
- **Bottleneck Detection**: Identify render-blocking scripts and network delays.
- **Color-Coded Categories**: Distinguish between Network, Render, and Script execution times.

### 📦 Bundle Intelligence
- **Asset Breakdown**: Detailed charts showing the size distribution of JS, CSS, and Images.
- **Optimization Tips**: actionable suggestions to reduce bundle bloat.

### 🕰️ History & Comparison
- **Session History**: Automatically tracks recent analyses.
- **Local Storage**: Persists data across page reloads for quick comparisons.

---

## 🛠️ Tech Stack

Built with the latest cutting-edge web technologies:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/frontend-performance-observatory.git
   cd frontend-performance-observatory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   *Note: usage of `@tailwindcss/postcss` and Tailwind v4 requires the latest dependencies.*

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the App**
   Visit [http://localhost:3000](http://localhost:3000) to see the dashboard in action.

---

## 🏗️ Project Structure

```
├── app/
│   ├── api/             # Next.js API Routes (Server-side analysis logic)
│   ├── components/      # React components (Dashboard, Hero, Metrics)
│   │   └── ui/          # Reusable UI primitives (Cards, Buttons, Inputs)
│   ├── lib/             # Utilities and mock data generators
│   └── types.ts         # TypeScript definitions for metrics & analysis
├── public/              # Static assets
└── ...
```

---

## 🔌 Connecting Real Data

By default, the application runs in **Simulation Mode** to provide a seamless demo experience. To connect it to real live data:

1. Obtain a **Google PageSpeed Insights API Key**.
2. Open `app/api/analyze/route.ts`.
3. Uncomment the fetch logic and replace the mock generator with your API call.

```typescript
// app/api/analyze/route.ts
const API_KEY = process.env.PSI_API_KEY;
const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${targetUrl}&key=${API_KEY}`;
// ... fetch and parse logic
```

---

## 🎨 Design Philosophy

This project adheres to **Aesthetic-Usability principles**. 

- **Typography**: Clean, varied weights using Geist Sans/Mono.
- **Color Palette**: Semantically meaningful colors (Emerald/Amber/Rose) for status, set against a deep zinc/slate dark mode background.
- **Feedback**: Every interaction provides immediate visual feedback through hover states and transitions.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
