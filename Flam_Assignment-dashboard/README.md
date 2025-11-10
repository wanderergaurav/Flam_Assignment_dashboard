
# Performance Dashboard (Assignment Deliverable)

This repository contains a Next.js + TypeScript project scaffold implementing a performance-critical real-time dashboard.
It includes:
- Multiple chart components (canvas-based) templates
- Data generator that produces 10,000+ time-series points
- Hooks for streaming and performance monitoring
- Sample dataset (10,000 rows) and a sample PNG output
- PERFORMANCE.md with benchmarking notes

Generated on: 2025-11-09T13:43:01.669630 UTC


## Added Components
- BarChart (canvas-based)
- ScatterPlot (canvas-based)
- Heatmap (bucketed canvas heatmap)
- WebWorker template for aggregation (worker/dataWorker.ts)
\n\n## Running the Dashboard\n1. npm install\n2. npm run dev\n3. Open http://localhost:3000/dashboard\n