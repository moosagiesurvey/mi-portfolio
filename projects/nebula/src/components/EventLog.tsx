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
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--gray)",
          marginBottom: 16,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Live Event Stream
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {events.length === 0 && (
          <span style={{ color: "var(--gray)", fontSize: 13 }}>
            Waiting for data...
          </span>
        )}
        {events.map((ev, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px",
              borderRadius: 8,
              background:
                i === 0 ? "rgba(0, 240, 255, 0.04)" : "transparent",
              fontSize: 13,
              color: i === 0 ? "#d0d0f0" : "var(--gray)",
              fontFamily: "monospace",
              animation:
                i === 0 ? "fade-slide 0.4s ease-out" : "none",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i === 0 ? "var(--cyan)" : "transparent",
                flexShrink: 0,
              }}
            ></span>
            <span>{ev}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
