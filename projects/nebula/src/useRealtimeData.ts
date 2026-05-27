import { useState, useEffect, useRef } from "react";
import { randomBetween, randomFloat, generateTimestamps } from "./utils";

export interface Metric {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

const INITIAL_METRICS: Metric[] = [
  { label: "Active Users", value: "0", change: 0, icon: "👤" },
  { label: "Page Views", value: "0", change: 0, icon: "👁" },
  { label: "Conversion Rate", value: "0%", change: 0, icon: "📈" },
  { label: "Avg. Session", value: "0s", change: 0, icon: "⏱" },
];

export function useRealtimeData() {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [revenueData, setRevenueData] = useState<ChartPoint[]>([]);
  const [trafficData, setTrafficData] = useState<ChartPoint[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const labels = generateTimestamps(20);
    setRevenueData(labels.map((l) => ({ label: l, value: 0 })));
    setTrafficData(labels.map((l) => ({ label: l, value: 0 })));

    const interval = setInterval(() => {
      counter.current++;

      const activeUsers = randomBetween(1200, 4800);
      const prevUsers = randomBetween(1200, 4800);
      const pageViews = randomBetween(8000, 25000);
      const prevViews = randomBetween(8000, 25000);
      const convRate = randomFloat(2.1, 8.9);
      const prevConv = randomFloat(2.1, 8.9);
      const avgSession = randomBetween(45, 320);
      const prevSession = randomBetween(45, 320);

      setMetrics([
        {
          label: "Active Users",
          value: activeUsers.toLocaleString(),
          change: parseFloat(
            (((activeUsers - prevUsers) / prevUsers) * 100).toFixed(1)
          ),
          icon: "👤",
        },
        {
          label: "Page Views",
          value: pageViews.toLocaleString(),
          change: parseFloat(
            (((pageViews - prevViews) / prevViews) * 100).toFixed(1)
          ),
          icon: "👁",
        },
        {
          label: "Conversion Rate",
          value: `${convRate}%`,
          change: parseFloat(((convRate - prevConv) / prevConv * 100).toFixed(1)),
          icon: "📈",
        },
        {
          label: "Avg. Session",
          value: `${avgSession}s`,
          change: parseFloat(
            (((avgSession - prevSession) / prevSession) * 100).toFixed(1)
          ),
          icon: "⏱",
        },
      ]);

      setRevenueData((prev) => {
        const next = [...prev, { label: "", value: randomFloat(12000, 45000) }];
        if (next.length > 20) next.shift();
        return next.map((p, i) => ({
          ...p,
          label: new Date(
            Date.now() - (next.length - 1 - i) * 2000
          ).toLocaleTimeString(),
        }));
      });

      setTrafficData((prev) => {
        const next = [...prev, { label: "", value: randomBetween(300, 1800) }];
        if (next.length > 20) next.shift();
        return next.map((p, i) => ({
          ...p,
          label: new Date(
            Date.now() - (next.length - 1 - i) * 2000
          ).toLocaleTimeString(),
        }));
      });

      const eventTypes = [
        "New user signup",
        "Order completed",
        "Page viewed: /pricing",
        "API call: /v1/analytics",
        "Session expired",
        "File uploaded",
        "Search query executed",
        "Payment processed",
      ];
      setEvents((prev) => {
        const next = [
          `${new Date().toLocaleTimeString()} — ${
            eventTypes[Math.floor(Math.random() * eventTypes.length)]
          }`,
          ...prev,
        ];
        if (next.length > 20) next.pop();
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { metrics, revenueData, trafficData, events };
}
