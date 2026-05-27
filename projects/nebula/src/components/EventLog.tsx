interface Props {
  events: string[];
}

export default function EventLog({ events }: Props) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 600, color: "var(--gray)",
          textTransform: "uppercase" as const, letterSpacing: "0.05em",
        }}>
          Realtime Activity Log
        </h3>
        <span style={{ fontSize: 12, color: "var(--gray)", fontFamily: "monospace" }}>
          {events.length > 0 ? `${events.length} records` : ""}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflow: "auto" }}>
        {events.length === 0 && (
          <span style={{ color: "var(--gray)", fontSize: 13 }}>
            Collecting data...
          </span>
        )}
        {events.map((ev, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 10px",
              borderRadius: 8,
              background: i < 3 ? "rgba(0, 240, 255, 0.04)" : "transparent",
              fontSize: 12,
              color: i < 3 ? "#d0d0f0" : "var(--gray)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: i < 3 ? "var(--cyan)" : "transparent", flexShrink: 0,
            }}></span>
            <span>{ev}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
