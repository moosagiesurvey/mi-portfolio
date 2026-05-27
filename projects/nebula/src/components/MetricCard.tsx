import type { Metric } from "../useRealtimeData";

interface Props {
  metric: Metric;
}

export default function MetricCard({ metric }: Props) {
  const isPositive = metric.change >= 0;

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <span style={styles.icon}>{metric.icon}</span>
        <span style={styles.label}>{metric.label}</span>
      </div>
      <div style={styles.value}>{metric.value}</div>
      <div style={{ ...styles.change, color: isPositive ? "#00f0ff" : "#ff4d6a" }}>
        <span>{isPositive ? "▲" : "▼"}</span>
        <span>{Math.abs(metric.change)}% vs previous</span>
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
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 13,
    color: "var(--gray)",
    fontWeight: 500,
  },
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
