import type { AlertConfig } from "../utils";

interface Props {
  configs: AlertConfig[];
  onToggle: (id: string, enabled: boolean) => void;
}

export default function AlertSettings({ configs, onToggle }: Props) {
  return (
    <div
      style={{
        marginBottom: 24,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "20px",
        backdropFilter: "blur(12px)",
      }}
    >
      <h3 style={{
        fontSize: 14, fontWeight: 600, color: "var(--gray)",
        marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: "0.05em",
      }}>
        Threshold Alerts
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {configs.map((cfg) => (
          <div
            key={cfg.id}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", background: cfg.enabled ? "rgba(0, 240, 255, 0.04)" : "rgba(255,255,255,0.02)",
              borderRadius: 10, border: `1px solid ${cfg.enabled ? "rgba(0, 240, 255, 0.2)" : "var(--border)"}`,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#d0d0f0" }}>{cfg.label}</div>
              <div style={{ fontSize: 11, color: "var(--gray)", fontFamily: "monospace" }}>
                {cfg.operator === ">" ? "Above" : "Below"} {cfg.threshold}{cfg.metric === "revenue" ? "$" : cfg.metric === "conversionRate" ? "%" : cfg.metric === "avgSession" ? "s" : ""}
              </div>
            </div>
            <button
              onClick={() => onToggle(cfg.id, !cfg.enabled)}
              style={{
                width: 44, height: 26, borderRadius: 13, border: "none",
                background: cfg.enabled ? "var(--cyan)" : "rgba(255,255,255,0.1)",
                cursor: "pointer", position: "relative", padding: 0,
                transition: "background 0.2s",
              }}
            >
              <span style={{
                display: "block", width: 20, height: 20, borderRadius: "50%",
                background: "#fff", position: "absolute",
                left: cfg.enabled ? 22 : 2, top: 3,
                transition: "left 0.2s",
              }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
