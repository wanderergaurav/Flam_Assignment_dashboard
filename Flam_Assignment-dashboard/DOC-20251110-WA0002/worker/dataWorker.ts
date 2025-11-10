// Example WebWorker: data aggregation template
self.addEventListener('message', (ev) => {
  const { cmd, payload } = ev.data || {};
  if (cmd === 'aggregate') {
    // payload: { points: [{timestamp, value}], buckets: number }
    const points = payload.points || [];
    const buckets = payload.buckets || 100;
    const result = new Array(buckets).fill(0);
    if (points.length) {
      const min = points[0].timestamp, max = points[points.length-1].timestamp;
      const span = (max - min) || 1;
      for (const p of points) {
        const idx = Math.min(buckets-1, Math.floor(((p.timestamp - min)/span)*buckets));
        result[idx] += p.value;
      }
    }
    // post back aggregated buckets
    self.postMessage({ cmd: 'aggregated', result });
  }
});
