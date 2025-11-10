'use client';
import React, { useRef, useEffect, useMemo } from 'react';

type Point = { timestamp: number; value: number };

export default function BarChart({ data, width=600, height=300 }: { data: Point[]; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const processed = useMemo(() => {
    if (!data || data.length === 0) return [];
    const maxBars = Math.min(200, data.length);
    const step = Math.floor(data.length / maxBars) || 1;
    const out: Point[] = [];
    for (let i=0;i<data.length;i+=step) out.push(data[i]);
    return out;
  }, [data]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const render = () => {
      ctx.clearRect(0,0,width,height);
      if (processed.length === 0) return;
      let min = Infinity, max = -Infinity;
      for (const p of processed) { min = Math.min(min, p.value); max = Math.max(max, p.value); }
      const range = (max - min) || 1;
      const barW = (width - 40) / processed.length;
      for (let i=0;i<processed.length;i++) {
        const p = processed[i];
        const x = 20 + i*barW;
        const h = ((p.value - min)/range) * (height - 40);
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(x, height - 20 - h, Math.max(1, barW - 2), h);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [processed, width, height]);

  return <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />;
}
