import type { StoredPoint } from "./utils";
import { clamp, randomFloat, randomBetween } from "./utils";

export type ScenarioId = "saas" | "ecommerce" | "blog" | "csv" | "live";

export interface ScenarioInfo {
  id: ScenarioId;
  label: string;
  description: string;
  color: string;
}

export const SCENARIOS: ScenarioInfo[] = [
  { id: "saas", label: "SaaS Startup", description: "MRR growth, user signups, churn tracking", color: "#00f0ff" },
  { id: "ecommerce", label: "E-commerce Store", description: "Daily sales, orders, cart abandonment", color: "#7b2ff7" },
  { id: "blog", label: "Content Blog", description: "Page views, subscribers, social shares", color: "#ff00e5" },
  { id: "live", label: "Live Demo", description: "Real-time simulation with trends", color: "#00ff88" },
  { id: "csv", label: "My Data", description: "Upload your own CSV", color: "#ffaa00" },
];

const HOUR = 3600000;
const DAY = 24 * HOUR;
const SEED_POINTS = 672; // 7 days × 96 points/day (15min intervals)

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function seed(day: number, hour: number, minute: number): number {
  return day * 1000 + hour * 60 + minute;
}

function makeTrend(timeMs: number, base: number, weeklyGrowth: number, dailyPeak: number): number {
  const hourOfDay = new Date(timeMs).getHours();
  const dayOfWeek = new Date(timeMs).getDay();
  const daysFromStart = (timeMs - (Date.now() - 7 * DAY)) / DAY;

  const growth = 1 + (daysFromStart / 7) * weeklyGrowth;
  const hourly = 1 + Math.sin(((hourOfDay - 8) / 16) * Math.PI) * dailyPeak;
  const weekend = dayOfWeek >= 6 ? 0.6 : 1.0;
  const noise = 1 + randomFloat(-0.08, 0.08);

  return base * growth * hourly * weekend * noise;
}

export function generateScenarioData(scenario: ScenarioId): StoredPoint[] {
  const now = Date.now();
  const startTime = now - 7 * DAY;
  const points: StoredPoint[] = [];
  const interval = 15 * 60 * 1000; // 15 min

  for (let i = 0; i < SEED_POINTS; i++) {
    const ts = startTime + i * interval;
    const s = seed(Math.floor(i / 96), Math.floor((i % 96) / 4), (i % 4) * 15);
    seededRandom(s);

    let users: number, pageViews: number, revenue: number, traffic: number;
    let conversionRate: number, avgSession: number;

    switch (scenario) {
      case "saas":
        users = Math.round(clamp(makeTrend(ts, 320, 0.12, 0.45) + randomBetween(-20, 20), 50, 800));
        pageViews = Math.round(users * clamp(4 + randomFloat(-0.5, 0.5), 2, 8));
        revenue = clamp(50 + users * 1.2 + randomFloat(-30, 40), 200, 5000);
        conversionRate = clamp(4.5 + randomFloat(-0.8, 0.8) + (daysFromTrend(ts) * 0.05), 1.5, 12);
        traffic = Math.round(users * clamp(0.3 + randomFloat(-0.05, 0.05), 0.1, 0.6));
        avgSession = Math.round(clamp(180 + randomFloat(-30, 30) + Math.sin((ts / DAY) * Math.PI * 2) * 20, 30, 400));
        break;

      case "ecommerce":
        users = Math.round(clamp(makeTrend(ts, 180, 0.08, 0.6) + randomBetween(-15, 15), 30, 600));
        pageViews = Math.round(users * clamp(5.5 + randomFloat(-0.6, 0.6), 2.5, 10));
        revenue = clamp(200 + users * 3.5 + randomFloat(-50, 80), 300, 8000);
        conversionRate = clamp(2.8 + randomFloat(-0.4, 0.4) - (new Date(ts).getDay() >= 6 ? 0.3 : 0), 0.5, 6);
        traffic = Math.round(users * clamp(0.4 + randomFloat(-0.05, 0.05), 0.15, 0.7));
        avgSession = Math.round(clamp(240 + randomFloat(-40, 40), 40, 500));
        break;

      case "blog":
        users = Math.round(clamp(makeTrend(ts, 500, 0.15, 0.3) + randomBetween(-30, 30), 100, 2000));
        pageViews = Math.round(users * clamp(2.2 + randomFloat(-0.3, 0.3), 1.2, 4));
        revenue = clamp(randomFloat(5, 40) + users * 0.05, 0, 200);
        conversionRate = clamp(1.2 + randomFloat(-0.3, 0.3), 0.2, 3);
        traffic = Math.round(users * clamp(0.6 + randomFloat(-0.08, 0.08), 0.3, 0.9));
        avgSession = Math.round(clamp(90 + randomFloat(-20, 20) + Math.sin((ts / DAY) * Math.PI * 3) * 15, 20, 200));
        break;

      default: // live
        users = Math.round(clamp(1200 + 600 * Math.sin(i * 0.08) + randomBetween(-80, 80), 300, 5000));
        pageViews = Math.round(users * clamp(3.5 + randomFloat(-0.3, 0.3), 1.5, 8));
        revenue = clamp(15000 + 8000 * Math.sin(i * 0.04) + randomFloat(-2000, 2000), 5000, 55000);
        traffic = Math.round(clamp(800 + 400 * Math.sin(i * 0.05) + randomBetween(-100, 100), 200, 2200));
        conversionRate = clamp(4.5 + 1.5 * Math.sin(i * 0.03) + randomFloat(-0.5, 0.5), 1, 12);
        avgSession = Math.round(clamp(120 + 60 * Math.sin(i * 0.02) + randomBetween(-20, 20), 20, 360));
        break;
    }

    points.push({
      ts,
      users: Math.round(users),
      pageViews: Math.round(pageViews),
      revenue: parseFloat(revenue.toFixed(2)),
      traffic: Math.round(traffic),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      avgSession: Math.round(avgSession),
    });
  }

  return points;
}

function daysFromTrend(ts: number): number {
  return (ts - (Date.now() - 7 * DAY)) / DAY;
}

export function parseCSVToPoints(text: string): { points: StoredPoint[]; error?: string } {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { points: [], error: "CSV must have a header row and at least one data row" };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const requiredCols = ["timestamp", "users", "pageviews", "revenue", "traffic", "conversionrate", "avgsession"];
  const colMap: Record<string, number> = {};
  for (const h of headers) {
    if (requiredCols.includes(h)) colMap[h] = headers.indexOf(h);
  }

  if (!colMap["timestamp"]) return { points: [], error: "CSV must include a 'timestamp' column" };

  const points: StoredPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const ts = Date.parse(cols[colMap["timestamp"]]?.trim());
    if (isNaN(ts)) continue;

    points.push({
      ts,
      users: colMap["users"] !== undefined ? parseInt(cols[colMap["users"]]) || 0 : 0,
      pageViews: colMap["pageviews"] !== undefined ? parseInt(cols[colMap["pageviews"]]) || 0 : 0,
      revenue: colMap["revenue"] !== undefined ? parseFloat(cols[colMap["revenue"]]) || 0 : 0,
      traffic: colMap["traffic"] !== undefined ? parseInt(cols[colMap["traffic"]]) || 0 : 0,
      conversionRate: colMap["conversionrate"] !== undefined ? parseFloat(cols[colMap["conversionrate"]]) || 0 : 0,
      avgSession: colMap["avgsession"] !== undefined ? parseInt(cols[colMap["avgsession"]]) || 0 : 0,
    });
  }

  if (points.length === 0) return { points: [], error: "No valid data rows found. Timestamp column must be parseable dates." };
  return { points };
}
