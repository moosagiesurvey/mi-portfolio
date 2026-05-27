import type { Alert } from "../utils";

interface Props {
  alerts: Alert[];
  total: number;
  onAcknowledge: (id: string) => void;
  onClear: () => void;
}

export default function AlertPanel({ alerts, total, onAcknowledge, onClear }: Props) {
  return (
    <div
      style={{
        marginBottom: 24,
        background: "rgba(255, 77, 106, 0.06)",
        border: "1px solid rgba(255, 77, 106, 0.2)",
        borderRadius: 16,
        padding: "16px 20px",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <span style={{ fontWeight: 700, color: "#ff4d6a", fontSize: 14 }}>
            {alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: 12, color: "var(--gray)" }}>
            ({total} total)
          </span>
        </div>
        <button
          onClick={onClear}
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 77, 106, 0.3)",
            color: "#ff4d6a",
            padding: "4px 12px",
            borderRadius: 6,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Acknowledge All
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "rgba(255, 77, 106, 0.04)",
              borderRadius: 10,
              fontSize: 13,
              color: "#d0d0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d6a", flexShrink: 0 }}></span>
              <span>{alert.message}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, color: "var(--gray)", fontFamily: "monospace" }}>
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
              <button
                onClick={() => onAcknowledge(alert.id)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--gray)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
        {alerts.length > 5 && (
          <span style={{ fontSize: 12, color: "var(--gray)", textAlign: "center" as const }}>
            +{alerts.length - 5} more alerts
          </span>
        )}
      </div>
    </div>
  );
}
