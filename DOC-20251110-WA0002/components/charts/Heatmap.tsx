'use client';
import React, { useRef, useEffect } from 'react';

type Point = { x: number; y: number };

export default function Heatmap({ data, width=600, height=300, cols=50, rows=20 }: { data: Point[]; width?: number; height?: number; cols?: number; rows?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = width; c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // bucket points
    const buckets = Array.from({length:rows}, ()=>Array(cols).fill(0));
    if (data && data.length) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of data) { minX = Math.min(minX,p.x); maxX = Math.max(maxX,p.x); minY = Math.min(minY,p.y); maxY = Math.max(maxY,p.y); }
      const rx = (maxX - minX) || 1; const ry = (maxY - minY) || 1;
      for (const p of data) {
        const cx = Math.min(cols-1, Math.floor(((p.x-minX)/rx)*cols));
        const cy = Math.min(rows-1, Math.floor(((p.y-minY)/ry)*rows));
        buckets[cy][cx] += 1;
      }
    }
    // find max
    let max = 0;
    for (const r of buckets) for (const v of r) if (v>max) max=v;
    // draw
    const cellW = (width-40)/cols; const cellH = (height-40)/rows;
    for (let r=0;r<rows;r++) for (let cidx=0;cidx<cols;cidx++) {
      const v = buckets[r][cidx];
      const intensity = max ? (v/max) : 0;
      // grayscale intensity
      const gray = Math.floor(255 - intensity*200);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      const x = 20 + cidx*cellW;
      const y = 20 + r*cellH;
      ctx.fillRect(x,y,Math.max(1,cellW-1),Math.max(1,cellH-1));
    }
  }, [data, width, height, cols, rows]);

  return <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />;
}
