import { useState, Component } from "react";
import { useRealtimeData } from "./useRealtimeData";
import { exportCSV, type DateRange } from "./utils";
import MetricCard from "./components/MetricCard";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import EventLog from "./components/EventLog";
import AIInsight from "./components/AIInsight";
import AlertPanel from "./components/AlertPanel";
import AlertSettings from "./components/AlertSettings";
import DataSourcePanel from "./components/DataSourcePanel";
import CryptoInput from "./components/CryptoInput";
import GitHubInput from "./components/GitHubInput";
import type { DataSourceMode } from "./components/DataSourcePanel";

const VIEWS = ["Overview", "Traffic", "Revenue", "Events"] as const;
type View = (typeof VIEWS)[number];
const RANGE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: "1h", label: "1H" },
  { key: "6h", label: "6H" },
  { key: "24h", label: "24H" },
  { key: "7d", label: "7D" },
  { key: "all", label: "ALL" },
];

const MODE_LABELS: Record<DataSourceMode, string> = {
  saas: "SaaS Startup",
  ecommerce: "E-commerce",
  blog: "Content Blog",
  live: "Live Simulation",
  csv: "My Data",
  crypto: "Crypto Prices",
  github: "GitHub Stats",
};

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, fontFamily: "monospace" }}>
        <div style={{ color: "#ff4d6a", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Runtime Error</div>
        <div style={{ color: "#ff4d6a", fontSize: 13 }}>{this.state.error}</div>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  const {
    scenario, setScenario, metrics, revenueData, trafficData, usersData, conversionData,
    events, range, setRange, alerts, acknowledgeAlert, clearAlerts,
    alertConfigs, updateAlertConfig, allPoints, filteredPoints,
  } = useRealtimeData();

  const [mode, setMode] = useState<DataSourceMode>(scenario as DataSourceMode);
  const [view, setView] = useState<View>("Overview");
  const [showSettings, setShowSettings] = useState(false);

  const isExternal = mode === "crypto" || mode === "github";
  const isScenario = !isExternal;

  function handleModeChange(newMode: DataSourceMode) {
    setMode(newMode);
    if (newMode !== "crypto" && newMode !== "github") {
      setScenario(newMode);
    }
  }

  const handleExport = () => {
    exportCSV(allPoints, `nebula-${scenario}-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <ErrorBoundary>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>☁</span>
            <span style={styles.logoText}>
              <span style={styles.logoAccent}>NEBULA</span>
            </span>
          </div>

          <DataSourcePanel mode={mode} onModeChange={handleModeChange} />

          <div style={{ height: 1, background: "var(--border)", margin: "8px 10px" }} />

          {isScenario && (
            <nav style={styles.nav}>
              {VIEWS.map((item) => (
                <button key={item} onClick={() => setView(item)}
                  style={{ ...styles.navItem, ...(view === item ? styles.navItemActive : {}) }}>
                  {item}
                </button>
              ))}
              <div style={{ marginTop: 8, marginBottom: 4, height: 1, background: "var(--border)" }} />
              <button onClick={() => setShowSettings(!showSettings)}
                style={{ ...styles.navItem, ...(showSettings ? styles.navItemActive : {}) }}>
                Alert Settings
              </button>
            </nav>
          )}

          <div style={styles.sidebarFooter}>
            <span style={styles.statusDot}></span>
            <span style={{ color: "var(--gray)", fontSize: 12 }}>
              {isScenario ? `Live · ${filteredPoints.length} pts` : MODE_LABELS[mode]}
            </span>
          </div>
        </aside>

        <div style={styles.main}>
          <header style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={styles.title}>
                {isScenario ? `${MODE_LABELS[mode]} Analytics` : MODE_LABELS[mode]}
              </h1>
              {isScenario && (
                <div style={styles.headerBadge}>
                  <span style={styles.pulse}></span>
                  <span style={{ fontSize: 13, color: "var(--cyan)" }}>LIVE</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isScenario && (
                <>
                  <div style={styles.rangeBtns}>
                    {RANGE_OPTIONS.map((r) => (
                      <button key={r.key} onClick={() => setRange(r.key)}
                        style={{ ...styles.rangeBtn, ...(range === r.key ? styles.rangeBtnActive : {}) }}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleExport} style={styles.exportBtn}>Export CSV</button>
                </>
              )}
            </div>
          </header>

          {/* External data sources full-width */}
          {mode === "crypto" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <CryptoInput />
            </div>
          )}

          {mode === "github" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <GitHubInput />
            </div>
          )}

          {/* Scenario dashboard */}
          {isScenario && (
            <>
              {(view === "Overview" || view === "Traffic" || view === "Revenue") && (
                <>
                  <div style={styles.metrics}>
                    {metrics.map((m, i) => (
                      <MetricCard key={m.label} metric={m} alertConfigs={alertConfigs} index={i} />
                    ))}
                  </div>
                  <AIInsight metrics={metrics} pointCount={filteredPoints.length} range={range} />
                </>
              )}

              {alerts.length > 0 && (
                <AlertPanel alerts={alerts} total={alerts.length} onAcknowledge={acknowledgeAlert} onClear={clearAlerts} />
              )}

              {showSettings && <AlertSettings configs={alertConfigs} onToggle={updateAlertConfig} />}

              {view === "Overview" && (
                <>
                  <div style={styles.charts}>
                    <div style={styles.chartCard}>
                      <h3 style={styles.chartTitle}>Revenue (USD)</h3>
                      <LineChart data={revenueData} color="#00f0ff" />
                    </div>
                    <div style={styles.chartCard}>
                      <h3 style={styles.chartTitle}>Traffic</h3>
                      <BarChart data={trafficData} color="#7b2ff7" />
                    </div>
                  </div>
                  <EventLog events={events} />
                </>
              )}

              {view === "Traffic" && (
                <div style={styles.charts}>
                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Active Users</h3>
                    <LineChart data={usersData} color="#00f0ff" />
                  </div>
                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Site Visits</h3>
                    <BarChart data={trafficData} color="#7b2ff7" />
                  </div>
                </div>
              )}

              {view === "Revenue" && (
                <div style={styles.charts}>
                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Revenue Trend</h3>
                    <LineChart data={revenueData} color="#00f0ff" />
                  </div>
                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Conversion Rate</h3>
                    <LineChart data={conversionData} color="#ff00e5" />
                  </div>
                </div>
              )}

              {view === "Events" && <EventLog events={events} />}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: { display: "flex", minHeight: "100vh" },
  sidebar: { width: 220, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", padding: "24px 16px", display: "flex", flexDirection: "column", flexShrink: 0 },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 },
  logoIcon: { fontSize: 24, color: "var(--cyan)" },
  logoText: { fontFamily: "Orbitron, sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em" },
  logoAccent: { background: "linear-gradient(135deg, var(--cyan), var(--magenta))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: { padding: "10px 14px", borderRadius: 10, color: "var(--gray)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "all 0.2s", background: "none", border: "none", textAlign: "left" as const, cursor: "pointer", fontFamily: "Inter, sans-serif" },
  navItemActive: { background: "rgba(0, 240, 255, 0.08)", color: "var(--cyan)" },
  sidebarFooter: { display: "flex", alignItems: "center", gap: 8, paddingTop: 16, borderTop: "1px solid var(--border)" },
  statusDot: { width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", animation: "pulse-dot 2s infinite" },
  main: { flex: 1, padding: "32px 40px", overflowY: "auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap" as const, gap: 12 },
  title: { fontFamily: "Orbitron, sans-serif", fontSize: 24, fontWeight: 600, color: "#fff" },
  headerBadge: { display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(0, 240, 255, 0.08)", border: "1px solid rgba(0, 240, 255, 0.2)" },
  pulse: { width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)", animation: "pulse-dot 1.5s infinite" },
  metrics: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 },
  charts: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 },
  chartCard: { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, backdropFilter: "blur(12px)" },
  chartTitle: { fontSize: 14, fontWeight: 600, color: "var(--gray)", marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  rangeBtns: { display: "flex", background: "var(--bg-card)", borderRadius: 10, padding: 3, border: "1px solid var(--border)" },
  rangeBtn: { padding: "6px 14px", background: "transparent", border: "none", borderRadius: 8, color: "var(--gray)", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "Inter, sans-serif", transition: "all 0.2s" },
  rangeBtnActive: { background: "rgba(0, 240, 255, 0.12)", color: "var(--cyan)" },
  exportBtn: { padding: "8px 18px", background: "linear-gradient(135deg, var(--cyan), var(--purple))", border: "none", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" },
};
