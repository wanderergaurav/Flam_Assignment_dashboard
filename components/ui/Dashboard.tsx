'use client';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import ScatterPlot from '../charts/ScatterPlot';
import Heatmap from '../charts/Heatmap';
import { DataContext } from '../providers/DataProvider';

function toScatter(data: any[]) {
  // create x/y pairs from time and value: x = index, y = value
  return data.map((d, i) => ({ x: i, y: d.value }));
}

function toHeatmap(data: any[], cols=50, rows=20) {
  // map timestamps -> x, value -> y scaled
  return data.map((d, i) => ({ x: d.timestamp, y: d.value }));
}

export default function Dashboard() {
  const ctx = useContext(DataContext);
  const data = ctx?.data ?? [];
  const [chart, setChart] = useState<'line'|'bar'|'scatter'|'heatmap'>('line');
  const [points, setPoints] = useState<number>(10000);
  const [streaming, setStreaming] = useState(true);

  // control streaming by toggling provider's interval: we'll use a hacky approach by mounting/unmounting provider elsewhere;
  useEffect(() => {
    // no-op here; DataProvider handles streaming
  }, [streaming]);

  const sampled = useMemo(() => {
    if (!data) return [];
    if (data.length <= points) return data;
    const step = Math.max(1, Math.floor(data.length/points));
    const out = [];
    for (let i=0;i<data.length;i+=step) out.push(data[i]);
    return out;
  }, [data, points]);

  const scatter = useMemo(() => toScatter(sampled), [sampled]);
  const heat = useMemo(() => toHeatmap(sampled), [sampled]);

  return (
    <div style={{ padding: 16, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Assignment Dashboard</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setChart('line')} style={{ padding: '8px 12px' }}>Line</button>
          <button onClick={() => setChart('bar')} style={{ padding: '8px 12px' }}>Bar</button>
          <button onClick={() => setChart('scatter')} style={{ padding: '8px 12px' }}>Scatter</button>
          <button onClick={() => setChart('heatmap')} style={{ padding: '8px 12px' }}>Heatmap</button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <label>
            Points:
            <select value={points} onChange={(e)=>setPoints(Number(e.target.value))} style={{ marginLeft: 6 }}>
              <option value={10000}>10000</option>
              <option value={5000}>5000</option>
              <option value={2000}>2000</option>
              <option value={1000}>1000</option>
              <option value={500}>500</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={streaming} onChange={(e)=>setStreaming(e.target.checked)} />
            Streaming
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
          {chart === 'line' && <LineChart data={sampled} width={900} height={360} />}
          {chart === 'bar' && <BarChart data={sampled} width={900} height={360} />}
          {chart === 'scatter' && <ScatterPlot data={scatter} width={900} height={360} />}
          {chart === 'heatmap' && <Heatmap data={heat} width={900} height={360} cols={60} rows={30} />}
        </div>

        <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
          <h3>Metrics & Controls</h3>
          <p>Current data points: {data.length}</p>
          <p>Displayed points: {sampled.length}</p>
          <p>Chart type: {chart}</p>
          <p>Streaming: {streaming ? 'On' : 'Off'}</p>
          <details>
            <summary>Data sample (first 10 rows)</summary>
            <pre style={{ maxHeight: 240, overflow: 'auto' }}>{JSON.stringify(sampled.slice(0,10), null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}
