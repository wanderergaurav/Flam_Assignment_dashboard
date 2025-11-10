'use client';
import React, { useRef, useEffect, useMemo } from 'react';

type Point = { x: number; y: number };

export default function ScatterPlot({ data, width=600, height=300 }: { data: Point[]; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const processed = useMemo(() => data || [], [data]);

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
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of processed) {
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      }
      const rx = (maxX - minX) || 1;
      const ry = (maxY - minY) || 1;
      for (const p of processed) {
        const x = 20 + ((p.x - minX)/rx)*(width-40);
        const y = height - 20 - ((p.y - minY)/ry)*(height-40);
        ctx.beginPath();
        ctx.arc(x,y,2,0,Math.PI*2);
        ctx.fillStyle = '#e91e63';
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [processed, width, height]);

  return <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />;
}
