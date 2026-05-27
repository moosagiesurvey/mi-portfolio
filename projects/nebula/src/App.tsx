import { useRealtimeData } from "./useRealtimeData";
import MetricCard from "./components/MetricCard";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import EventLog from "./components/EventLog";
import AIInsight from "./components/AIInsight";

export default function App() {
  const { metrics, revenueData, trafficData, events } = useRealtimeData();

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>☁</span>
          <span style={styles.logoText}>
            <span style={styles.logoAccent}>NEBULA</span>
          </span>
        </div>
        <nav style={styles.nav}>
          {["Dashboard", "Analytics", "Reports", "Settings"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                ...styles.navItem,
                ...(item === "Dashboard" ? styles.navItemActive : {}),
              }}
            >
              <span>{item}</span>
            </a>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <span style={styles.statusDot}></span>
          <span style={{ color: "var(--gray)", fontSize: 12 }}>
            Live — 2s interval
          </span>
        </div>
      </aside>

      <div style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Analytics Dashboard</h1>
          <div style={styles.headerBadge}>
            <span style={styles.pulse}></span>
            <span style={{ fontSize: 13, color: "var(--cyan)" }}>LIVE</span>
          </div>
        </header>

        <div style={styles.metrics}>
          {metrics.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>

        <AIInsight metrics={metrics} />

        <div style={styles.charts}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Revenue (USD)</h3>
            <LineChart data={revenueData} color="var(--cyan)" />
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Site Traffic</h3>
            <BarChart data={trafficData} color="var(--purple)" />
          </div>
        </div>

        <EventLog events={events} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: 220,
    background: "var(--bg-secondary)",
    borderRight: "1px solid var(--border)",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 24,
    color: "var(--cyan)",
  },
  logoText: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  logoAccent: {
    background: "linear-gradient(135deg, var(--cyan), var(--magenta))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  navItem: {
    padding: "10px 14px",
    borderRadius: 10,
    color: "var(--gray)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.2s",
  },
  navItemActive: {
    background: "rgba(0, 240, 255, 0.08)",
    color: "var(--cyan)",
  },
  sidebarFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    borderTop: "1px solid var(--border)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--cyan)",
    boxShadow: "0 0 8px var(--cyan)",
    animation: "pulse-dot 2s infinite",
  },
  main: {
    flex: 1,
    padding: "32px 40px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  title: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: 24,
    fontWeight: 600,
    color: "#fff",
  },
  headerBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 16px",
    borderRadius: 20,
    background: "rgba(0, 240, 255, 0.08)",
    border: "1px solid rgba(0, 240, 255, 0.2)",
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--cyan)",
    boxShadow: "0 0 10px var(--cyan)",
    animation: "pulse-dot 1.5s infinite",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  charts: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 24,
  },
  chartCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 20,
    backdropFilter: "blur(12px)",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--gray)",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};
