import { type ScenarioId, SCENARIOS } from "../scenarios";

export type DataSourceMode = ScenarioId | "crypto" | "github";

interface Props {
  mode: DataSourceMode;
  onModeChange: (mode: DataSourceMode) => void;
}

export default function DataSourcePanel({ mode, onModeChange }: Props) {
  const modes: { id: DataSourceMode; label: string; icon: string }[] = [
    { id: "saas", label: "SaaS Demo", icon: "📊" },
    { id: "ecommerce", label: "E-commerce", icon: "🛒" },
    { id: "blog", label: "Blog Demo", icon: "📝" },
    { id: "live", label: "Live Demo", icon: "⚡" },
    { id: "crypto", label: "Crypto Prices", icon: "₿" },
    { id: "github", label: "GitHub Stats", icon: "★" },
  ];

  return (
    <div style={{ padding: "8px 4px" }}>
      <div style={{ fontSize: 10, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 10 }}>
        Data Source
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "8px 12px", borderRadius: 8, border: "none",
                background: active ? "rgba(0, 240, 255, 0.08)" : "transparent",
                color: active ? "var(--cyan)" : "var(--gray)",
                cursor: "pointer", fontSize: 12, textAlign: "left",
                fontFamily: "Inter, sans-serif", transition: "all 0.15s",
              }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
