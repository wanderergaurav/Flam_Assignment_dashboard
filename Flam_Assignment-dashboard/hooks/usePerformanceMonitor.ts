'use client';
import { useEffect, useState } from 'react';

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let last = performance.now();
    let frames = 0;
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      frames++;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return { fps };
}
