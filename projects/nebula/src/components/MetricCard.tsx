import type { Metric } from "../useRealtimeData";
import type { AlertConfig } from "../utils";

interface Props {
  metric: Metric;
  alertConfigs: AlertConfig[];
  index: number;
}

const METRIC_ALERT_MAP: Record<string, string> = {
  "Active Users": "users",
  "Page Views": "pageViews",
  "Conversion Rate": "conversionRate",
  "Avg. Session": "avgSession",
};

export default function MetricCard({ metric, alertConfigs, index }: Props) {
  const isPositive = metric.change >= 0;
  const metricKey = METRIC_ALERT_MAP[metric.label];
  const activeAlerts = alertConfigs.filter(
    (c) => c.metric === metricKey && c.enabled
  );

  return (
    <div
      style={{
        ...styles.card,
        animation: `fade-slide 0.4s ease-out ${index * 0.1}s both`,
        borderColor: activeAlerts.length > 0 ? "rgba(255, 77, 106, 0.25)" : undefined,
      }}
    >
      <div style={styles.top}>
        <span style={styles.icon}>{metric.icon}</span>
        <span style={styles.label}>{metric.label}</span>
        {activeAlerts.length > 0 && (
          <span
            title={`${activeAlerts.length} alert threshold${activeAlerts.length !== 1 ? "s" : ""} set`}
            style={{
              fontSize: 11,
              marginLeft: "auto",
              color: "#ff4d6a",
              background: "rgba(255, 77, 106, 0.1)",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            🔔
          </span>
        )}
      </div>
      <div style={styles.value}>{metric.value}</div>
      <div style={{ ...styles.change, color: isPositive ? "#00f0ff" : "#ff4d6a" }}>
        <span>{isPositive ? "▲" : "▼"}</span>
        <span>{Math.abs(Math.round(metric.change * 10) / 10)}% vs previous</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "18px 20px",
    backdropFilter: "blur(12px)",
    transition: "all 0.3s",
  },
  top: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  icon: { fontSize: 18 },
  label: { fontSize: 13, color: "var(--gray)", fontWeight: 500 },
  value: {
    fontSize: 28,
    fontFamily: "Orbitron, sans-serif",
    fontWeight: 700,
    color: "#fff",
    marginBottom: 8,
  },
  change: {
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 600,
  },
};
