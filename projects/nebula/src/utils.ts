export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface StoredPoint {
  ts: number;
  users: number;
  pageViews: number;
  revenue: number;
  traffic: number;
  conversionRate: number;
  avgSession: number;
}

export interface AlertConfig {
  id: string;
  metric: keyof StoredPoint;
  label: string;
  operator: ">" | "<";
  threshold: number;
  enabled: boolean;
}

export interface Alert {
  id: string;
  configId: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

const STORAGE_KEY = "nebula_data";
const ALERTS_KEY = "nebula_alerts";
const ALERT_CFG_KEY = "nebula_alert_configs";
const MAX_POINTS = 500;

export function loadData(): StoredPoint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveData(points: StoredPoint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(points.slice(-MAX_POINTS)));
  } catch {
    /* storage full — silently drop oldest */
  }
}

export function pruneOldData(points: StoredPoint[], maxAgeMs: number): StoredPoint[] {
  const cutoff = Date.now() - maxAgeMs;
  return points.filter((p) => p.ts > cutoff);
}

export function loadAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAlerts(alerts: Alert[]): void {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(-50)));
  } catch { /* ignore */ }
}

export const DEFAULT_ALERT_CONFIGS: AlertConfig[] = [
  { id: "a1", metric: "users", label: "Active Users", operator: ">", threshold: 4500, enabled: true },
  { id: "a2", metric: "users", label: "Active Users", operator: "<", threshold: 800, enabled: true },
  { id: "a3", metric: "conversionRate", label: "Conversion Rate", operator: "<", threshold: 2.5, enabled: true },
  { id: "a4", metric: "revenue", label: "Revenue", operator: ">", threshold: 40000, enabled: false },
  { id: "a5", metric: "avgSession", label: "Avg Session", operator: "<", threshold: 30, enabled: false },
  { id: "a6", metric: "traffic", label: "Traffic", operator: ">", threshold: 1800, enabled: false },
];

export function loadAlertConfigs(): AlertConfig[] {
  try {
    const raw = localStorage.getItem(ALERT_CFG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ALERT_CONFIGS;
  } catch {
    return DEFAULT_ALERT_CONFIGS;
  }
}

export function saveAlertConfigs(configs: AlertConfig[]): void {
  try {
    localStorage.setItem(ALERT_CFG_KEY, JSON.stringify(configs));
  } catch { /* ignore */ }
}

let trendSeed = 0;
export function generateTrendPoint(prev: StoredPoint | null): StoredPoint {
  trendSeed++;
  const hourOfDay = new Date().getHours();
  const timeFactor = 1 + Math.sin((hourOfDay / 24) * Math.PI * 2) * 0.3;

  const usersBase = 2500 + Math.sin(trendSeed * 0.1) * 600;
  const users = clamp(
    Math.max(0, Math.round(usersBase * timeFactor + randomBetween(-200, 200))),
    300, 5000
  );

  const pageViews = clamp(
    Math.round(users * (3.8 + randomFloat(-0.4, 0.4))),
    1000, 20000
  );

  const conversionRate = clamp(
    randomFloat(3.2, 7.5),
    1.0, 12.0
  );

  const avgSession = clamp(
    Math.round(120 + Math.sin(hourOfDay / 12 * Math.PI) * 40 + randomBetween(-25, 25)),
    20, 360
  );

  const traffic = clamp(
    Math.round(800 + Math.sin(trendSeed * 0.05) * 300 + randomBetween(-100, 200)),
    200, 2200
  );

  const revenue = clamp(
    prev
      ? clamp(prev.revenue + randomFloat(-3000, 4000), 8000, 50000)
      : randomFloat(20000, 35000),
    5000, 55000
  );

  return {
    ts: Date.now(),
    users,
    pageViews,
    revenue,
    traffic,
    conversionRate,
    avgSession,
  };
}

export function generateChartPoint(base: number, variance: number): number {
  return clamp(base + randomFloat(-variance, variance), 0, 999999);
}

export function exportCSV(points: StoredPoint[], filename = "nebula-data.csv"): void {
  const headers = ["Timestamp", "Active Users", "Page Views", "Revenue", "Traffic", "Conversion Rate", "Avg Session"];
  const rows = points.map((p) =>
    [
      new Date(p.ts).toISOString(),
      p.users,
      p.pageViews,
      p.revenue.toFixed(2),
      p.traffic,
      p.conversionRate.toFixed(2),
      p.avgSession,
    ].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type DateRange = "1h" | "6h" | "24h" | "7d" | "all";

export const DATE_RANGE_MS: Record<DateRange, number> = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  all: Infinity,
};

export function filterByRange(points: StoredPoint[], range: DateRange): StoredPoint[] {
  if (range === "all") return points;
  const cutoff = Date.now() - DATE_RANGE_MS[range];
  return points.filter((p) => p.ts > cutoff);
}
