export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateTimestamps(count: number): string[] {
  const now = Date.now();
  const timestamps: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now - i * 2000);
    timestamps.push(d.toLocaleTimeString());
  }
  return timestamps;
}

export function generateDataPoint(
  base: number,
  variance: number
): { value: number; change: number } {
  const change = randomFloat(-variance, variance);
  return { value: parseFloat((base + change).toFixed(2)), change };
}
