'use client';
import React, { createContext, useState, useEffect } from 'react';
import { generateInitialData } from '../../lib/dataGenerator';

export const DataContext = createContext<any>(null);

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(generateInitialData(10000));

  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        const newPoint = { timestamp: last.timestamp + 1000, value: last.value + (Math.random()-0.5)*2 };
        return [...next, newPoint];
      });
    }, 100);
    return () => clearInterval(iv);
  }, []);

  return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>;
}
