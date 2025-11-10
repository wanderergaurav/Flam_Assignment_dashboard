// Simple data generator exported for use on server/client
export function generateInitialData(n: number) {
  const out: any[] = [];
  const now = Date.now();
  let value = 50;
  for (let i=0;i<n;i++) {
    out.push({ timestamp: now - (n - i) * 1000, value: value + (Math.random()-0.5)*2 });
    value += (Math.random()-0.5)*0.5;
  }
  return out;
}
