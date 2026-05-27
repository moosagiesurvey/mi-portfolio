import type { Metric } from "../useRealtimeData";

interface Props {
  metrics: Metric[];
}

export default function AIInsight({ metrics }: Props) {
  const avgUsers = parseInt(metrics[0].value.replace(/,/g, ""), 10);
  const convRate = parseFloat(metrics[2].value);
  const avgSession = parseInt(metrics[3].value, 10);

  let insight = "Collecting data for AI insights...";
  let type: "positive" | "neutral" | "warning" = "neutral";

  if (avgUsers > 0) {
    if (avgUsers > 3000 && convRate > 4.5) {
      insight = `High engagement detected: ${avgUsers.toLocaleString()} active users with ${convRate}% conversion. Consider scaling infrastructure to maintain performance.`;
      type = "positive";
    } else if (avgSession < 60) {
      insight = `Low session duration (${avgSession}s) detected. User experience optimization recommended for better retention.`;
      type = "warning";
    } else {
      insight = `Steady traffic with ${avgUsers.toLocaleString()} active users and ${avgSession}s average session. Performance metrics within normal range.`;
      type = "neutral";
    }
  }

  const accentColor =
    type === "positive"
      ? "var(--cyan)"
      : type === "warning"
        ? "#ff4d6a"
        : "var(--purple)";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${accentColor}22`,
        borderRadius: 16,
        padding: "18px 22px",
        marginBottom: 24,
        backdropFilter: "blur(12px)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>🧠</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          AI Insight
        </span>
      </div>
      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
        {insight}
      </p>
    </div>
  );
}
