import { useState, useCallback } from "react";

interface Window {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
}

const APPS = [
  { id: "files", title: "File Explorer", icon: "📁" },
  { id: "terminal", title: "Terminal", icon: "⚡" },
  { id: "about", title: "About SynthOS", icon: "ℹ️" },
  { id: "projects", title: "Projects", icon: "📂" },
];

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function App() {
  const [windows, setWindows] = useState<Window[]>([
    { id: "welcome", title: "Welcome", icon: "✨", x: 80, y: 60, w: 480, h: 320, z: 1, minimized: false },
  ]);
  const [zCounter, setZCounter] = useState(2);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());

  setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);

  const openApp = useCallback((app: typeof APPS[number]) => {
    setWindows((prev) => {
      if (prev.find((w) => w.id === app.id)) {
        return prev.map((w) => w.id === app.id ? { ...w, minimized: false, z: zCounter } : w);
      }
      setZCounter((z) => z + 1);
      return [...prev, {
        id: app.id,
        title: app.title,
        icon: app.icon,
        x: 60 + prev.length * 30,
        y: 60 + prev.length * 30,
        w: 440,
        h: 300,
        z: zCounter,
        minimized: false,
      }];
    });
  }, [zCounter]);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, z: zCounter } : w));
    setZCounter((z) => z + 1);
  }, [zCounter]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: !w.minimized } : w));
  }, []);

  return (
    <div style={styles.desktop}>
      {/* Desktop Icons */}
      <div style={styles.desktopIcons}>
        {APPS.map((app) => (
          <div key={app.id} style={styles.icon} onDoubleClick={() => openApp(app)}>
            <div style={styles.iconImg}>{app.icon}</div>
            <div style={styles.iconLabel}>{app.title}</div>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.filter((w) => !w.minimized).map((win) => (
        <div
          key={win.id}
          style={{
            ...styles.window,
            left: win.x,
            top: win.y,
            width: win.w,
            height: win.h,
            zIndex: win.z,
          }}
          onMouseDown={() => focusWindow(win.id)}
        >
          <div style={styles.windowTitle}>
            <span>{win.icon} {win.title}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleMinimize(win.id)} style={styles.winBtn}>─</button>
              <button onClick={() => closeWindow(win.id)} style={{ ...styles.winBtn, color: "#ff4d6a" }}>✕</button>
            </div>
          </div>
          <div style={styles.windowContent}>
            {win.id === "welcome" && (
              <div style={{ padding: 20, textAlign: "center" as const }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#fff", marginBottom: 12 }}>
                  Welcome to <span style={{ color: "var(--cyan)" }}>SynthOS</span>
                </h2>
                <p style={{ color: "var(--gray)", lineHeight: 1.7, fontSize: 14 }}>
                  A synthetic operating system simulation running entirely in your browser.
                  Double-click an app icon on the desktop to get started.
                </p>
              </div>
            )}
            {win.id === "files" && (
              <div style={{ padding: 16 }}>
                {["Documents", "Projects", "Photos", "Downloads"].map((f) => (
                  <div key={f} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <span>📂</span> {f}
                  </div>
                ))}
              </div>
            )}
            {win.id === "terminal" && (
              <div style={{ padding: 16, fontFamily: "monospace", fontSize: 13, color: "var(--cyan)" }}>
                <div>$ SynthOS v1.0.0</div>
                <div>$ Type 'help' for commands</div>
                <div style={{ marginTop: 12, color: "var(--gray)" }}>
                  {"guest@synthos ~ $ "}
                  <span style={{ animation: "blink 1s step-end infinite" }}>▊</span>
                </div>
              </div>
            )}
            {win.id === "about" && (
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.8 }}>
                  <div><strong style={{ color: "#fff" }}>SynthOS</strong> <span style={{ color: "var(--gray)" }}>v1.0.0</span></div>
                  <div style={{ color: "var(--gray)" }}>Synthetic OS Simulation</div>
                  <div style={{ color: "var(--gray)" }}>Built with React + TypeScript</div>
                  <div style={{ color: "var(--gray)" }}>Canvas API rendering</div>
                </div>
                <div style={{ color: "var(--cyan)", fontSize: 12, marginTop: 16 }}>
                  Part of the NexusInfinity ecosystem
                </div>
              </div>
            )}
            {win.id === "projects" && (
              <div style={{ padding: 16 }}>
                {["Nebula Dashboard", "Quantum Forge", "CyberVault", "Aether Terminal"].map((p) => (
                  <div key={p} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <span>📄</span> {p}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Taskbar */}
      <div style={styles.taskbar}>
        <button onClick={() => openApp({ id: "start", title: "Start", icon: "◈" })} style={styles.startBtn}>
          ◈ Start
        </button>
        <div style={{ display: "flex", gap: 4, flex: 1 }}>
          {windows.map((win) => (
            <button
              key={win.id}
              onClick={() => {
                if (win.minimized) {
                  setWindows((prev) => prev.map((w) => w.id === win.id ? { ...w, minimized: false, z: zCounter } : w));
                  setZCounter((z) => z + 1);
                } else {
                  focusWindow(win.id);
                }
              }}
              style={{
                ...styles.taskItem,
                ...(win.minimized ? {} : { background: "rgba(0, 240, 255, 0.1)", borderColor: "rgba(0, 240, 255, 0.2)" }),
              }}
            >
              {win.icon} {win.title}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: "var(--gray)", fontFamily: "monospace" }}>{clock}</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  desktop: {
    height: "100vh",
    background: "linear-gradient(135deg, #0a0a12 0%, #0f0f20 50%, #0a0a12 100%)",
    position: "relative" as const,
    overflow: "hidden",
  },
  desktopIcons: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 20,
    position: "absolute" as const,
    left: 0,
    top: 0,
  },
  icon: {
    width: 80,
    height: 90,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  iconImg: {
    fontSize: 32,
    marginBottom: 6,
  },
  iconLabel: {
    fontSize: 11,
    color: "var(--text)",
    textAlign: "center" as const,
    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
  },
  window: {
    position: "absolute" as const,
    background: "rgba(10, 10, 20, 0.92)",
    border: "1px solid rgba(0, 240, 255, 0.15)",
    borderRadius: 12,
    overflow: "hidden",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    animation: "fade-in 0.2s ease-out",
    display: "flex",
    flexDirection: "column",
  },
  windowTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "rgba(0,0,0,0.3)",
    borderBottom: "1px solid var(--border)",
    fontSize: 13,
    color: "var(--text)",
    cursor: "move",
  },
  winBtn: {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    color: "var(--gray)",
    cursor: "pointer",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "Inter, sans-serif",
  },
  windowContent: {
    flex: 1,
    overflow: "auto",
  },
  taskbar: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    background: "var(--taskbar)",
    borderTop: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 8,
    backdropFilter: "blur(16px)",
  },
  startBtn: {
    padding: "6px 16px",
    background: "rgba(0, 240, 255, 0.1)",
    border: "1px solid rgba(0, 240, 255, 0.2)",
    borderRadius: 8,
    color: "var(--cyan)",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "Orbitron, sans-serif",
    whiteSpace: "nowrap" as const,
  },
  taskItem: {
    padding: "6px 14px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid transparent",
    borderRadius: 6,
    color: "var(--text)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap" as const,
    maxWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
