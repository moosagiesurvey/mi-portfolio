import { useState, useEffect, useRef, useCallback } from "react";
import type { StoredPoint, Alert, AlertConfig, DateRange } from "./utils";
import {
  saveData,
  pruneOldData,
  generateTrendPoint,
  saveAlerts,
  loadAlertConfigs,
  saveAlertConfigs,
  filterByRange,
} from "./utils";
import { generateScenarioData, type ScenarioId } from "./scenarios";

export interface Metric {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export interface ChartSeries {
  label: string;
  value: number;
}

const SCENARIO_KEY = "nebula_scenario";

function loadScenario(): ScenarioId {
  try { return (localStorage.getItem(SCENARIO_KEY) as ScenarioId) || "live"; }
  catch { return "live"; }
}

function saveScenario(id: ScenarioId) {
  try { localStorage.setItem(SCENARIO_KEY, id); } catch { /* */ }
}

export function useRealtimeData() {
  const [scenario, setScenarioState] = useState<ScenarioId>(loadScenario);

  const setScenario = useCallback((id: ScenarioId) => {
    setScenarioState(id);
    saveScenario(id);
  }, []);

  const [allPoints, setAllPoints] = useState<StoredPoint[]>(() => {
    const id = loadScenario();
    try { return generateScenarioData(id); } catch { return []; }
  });

  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Active Users", value: "0", change: 0, icon: "👤" },
    { label: "Page Views", value: "0", change: 0, icon: "👁" },
    { label: "Conversion Rate", value: "0%", change: 0, icon: "📈" },
    { label: "Avg. Session", value: "0s", change: 0, icon: "⏱" },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try { const r = localStorage.getItem("nebula_alerts"); return r ? JSON.parse(r) : []; }
    catch { return []; }
  });

  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>(() => {
    try { return loadAlertConfigs(); } catch { return []; }
  });

  const [range, setRange] = useState<DateRange>("7d");

  const allPointsRef = useRef(allPoints);
  allPointsRef.current = allPoints;
  const alertConfigsRef = useRef(alertConfigs);
  alertConfigsRef.current = alertConfigs;

  useEffect(() => { try { saveData(allPoints); } catch {} }, [allPoints]);
  useEffect(() => { try { saveAlerts(alerts); } catch {} }, [alerts]);
  useEffect(() => { try { saveAlertConfigs(alertConfigs); } catch {} }, [alertConfigs]);

  // Reseed when scenario changes
  useEffect(() => {
    const data = generateScenarioData(scenario);
    setAllPoints(data);
  }, [scenario]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const currentAllPoints = allPointsRef.current;
        const currentConfigs = alertConfigsRef.current;
        const prevPoint = currentAllPoints.length > 0 ? currentAllPoints[currentAllPoints.length - 1] : null;
        const newPoint = generateTrendPoint(prevPoint);

        setAllPoints((prev) => {
          try { return pruneOldData([...prev, newPoint], 8 * 24 * 60 * 60 * 1000); }
          catch { return prev; }
        });

        const calcChange = (curr: number, prev: number) =>
          prev === 0 ? 0 : parseFloat((((curr - prev) / prev) * 100).toFixed(1));

        const np = newPoint;
        const pp = prevPoint || np;

        setMetrics([
          { label: "Active Users", value: np.users.toLocaleString(), change: calcChange(np.users, pp.users), icon: "👤" },
          { label: "Page Views", value: np.pageViews.toLocaleString(), change: calcChange(np.pageViews, pp.pageViews), icon: "👁" },
          { label: "Conversion Rate", value: `${np.conversionRate}%`, change: calcChange(np.conversionRate * 100, pp.conversionRate * 100), icon: "📈" },
          { label: "Avg. Session", value: `${np.avgSession}s`, change: calcChange(np.avgSession, pp.avgSession), icon: "⏱" },
        ]);

        const metricValues: Record<string, number> = {
          users: np.users, pageViews: np.pageViews, revenue: np.revenue,
          traffic: np.traffic, conversionRate: np.conversionRate, avgSession: np.avgSession,
        };

        currentConfigs.forEach((cfg) => {
          if (!cfg.enabled) return;
          const val = metricValues[cfg.metric] ?? 0;
          const triggered = cfg.operator === ">" ? val > cfg.threshold : val < cfg.threshold;
          if (!triggered) return;
          setAlerts((prev) => {
            if (prev.find((a) => a.configId === cfg.id && !a.acknowledged)) return prev;
            const next = [{ id: `a${Date.now()}`, configId: cfg.id, message: `${cfg.label} ${cfg.operator === ">" ? "above" : "below"} threshold: ${val} ${cfg.operator} ${cfg.threshold}`, timestamp: Date.now(), acknowledged: false }, ...prev];
            return next.slice(0, 50);
          });
        });
      } catch { /* silence */ }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = useCallback((id: string) => setAlerts((p) => p.map((a) => a.id === id ? { ...a, acknowledged: true } : a)), []);
  const clearAlerts = useCallback(() => setAlerts([]), []);
  const updateAlertConfig = useCallback((id: string, enabled: boolean) => setAlertConfigs((p) => p.map((c) => c.id === id ? { ...c, enabled } : c)), []);

  const filteredPoints = filterByRange(allPoints, range);

  const fmt = (ts: number) => {
    try { return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); }
    catch { return String(ts); }
  };

  const seriesFrom = (fn: (p: StoredPoint) => number): ChartSeries[] =>
    filteredPoints.map((p) => ({ label: fmt(p.ts), value: fn(p) }));

  const revenueData = seriesFrom((p) => p.revenue);
  const trafficData = seriesFrom((p) => p.traffic);
  const usersData = seriesFrom((p) => p.users);
  const conversionData = seriesFrom((p) => p.conversionRate);

  const events: string[] = allPoints.slice(-30).reverse().map((p) => {
    try { return `${new Date(p.ts).toLocaleTimeString()} — Users: ${p.users} | Pages: ${p.pageViews} | Revenue: $${p.revenue.toFixed(0)}`; }
    catch { return `Data point at ${p.ts}`; }
  });

  return {
    scenario, setScenario, metrics, revenueData, trafficData, usersData, conversionData,
    events, range, setRange, alerts: alerts.filter((a) => !a.acknowledged),
    acknowledgedAlerts: alerts.filter((a) => a.acknowledged),
    acknowledgeAlert, clearAlerts, alertConfigs, updateAlertConfig, allPoints, filteredPoints,
  };
}
