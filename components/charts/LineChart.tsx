'use client';
import React, { useRef, useEffect, useMemo } from 'react';

type Point = { timestamp: number; value: number };

export default function LineChart({ data, width=800, height=300 }: { data: Point[]; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const processed = useMemo(() => {
    const w = width;
    if (!data || data.length === 0) return [];
    const step = Math.max(1, Math.floor(data.length / w));
    const out = [];
    for (let i=0;i<data.length;i+=step) out.push(data[i]);
    return out;
  }, [data, width]);

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
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ddd';
      ctx.beginPath();
      ctx.moveTo(0,height-20);
      ctx.lineTo(width,height-20);
      ctx.stroke();

      if (processed.length === 0) return;

      let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
      for (const p of processed) {
        if (p.value < min) min = p.value;
        if (p.value > max) max = p.value;
      }
      const range = (max - min) || 1;

      ctx.beginPath();
      for (let i=0;i<processed.length;i++) {
        const p = processed[i];
        const x = (i / (processed.length-1)) * (width-40) + 20;
        const y = height - 20 - ((p.value - min) / range) * (height - 40);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#0070f3';
      ctx.stroke();

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [processed, width, height]);

  return <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />;
}
