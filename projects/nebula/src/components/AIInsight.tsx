import type { Metric } from "../useRealtimeData";
import type { DateRange } from "../utils";

interface Props {
  metrics: Metric[];
  pointCount: number;
  range: DateRange;
}

export default function AIInsight({ metrics, pointCount, range }: Props) {
  const avgUsers = parseInt(metrics[0]?.value.replace(/,/g, "") || "0", 10);
  const pageViews = parseInt(metrics[1]?.value.replace(/,/g, "") || "0", 10);
  const convRate = parseFloat(metrics[2]?.value || "0");
  const avgSession = parseInt(metrics[3]?.value || "0", 10);

  let insight = "Collecting data for AI insights...";
  let type: "positive" | "neutral" | "warning" = "neutral";

  if (avgUsers > 0) {
    const pvPerUser = pageViews / (avgUsers || 1);
    if (avgUsers > 4000 && convRate > 5.0) {
      insight = `Strong performance: ${avgUsers.toLocaleString()} active users at ${convRate}% conversion. Page views per user: ${pvPerUser.toFixed(1)}. Infrastructure scaling recommended to sustain growth.`;
      type = "positive";
    } else if (avgSession < 40) {
      insight = `Retention alert: Avg session only ${avgSession}s. Bounce rate may be high. Review landing page UX and content engagement for improvement.`;
      type = "warning";
    } else if (pvPerUser < 2) {
      insight = `Low engagement: Users average ${pvPerUser.toFixed(1)} page views. Consider improving content discoverability with related content and navigation.`;
      type = "warning";
    } else if (convRate > 6.0) {
      insight = `Excellent conversion: ${convRate}% with ${avgSession}s avg session. Current content and UX strategy is performing well — maintain momentum.`;
      type = "positive";
    } else {
      insight = `Steady traffic: ${avgUsers.toLocaleString()} users, ${pageViews.toLocaleString()} page views. ${pointCount} data points in ${range} range. All metrics within normal operating range.`;
      type = "neutral";
    }
  }

  const accentColor =
    type === "positive" ? "var(--cyan)" : type === "warning" ? "#ff4d6a" : "var(--purple)";

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
        <span style={{
          fontSize: 12, fontWeight: 600, color: accentColor,
          textTransform: "uppercase" as const, letterSpacing: "0.08em",
        }}>
          AI Insight • {type.toUpperCase()}
        </span>
      </div>
      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
        {insight}
      </p>
    </div>
  );
}
