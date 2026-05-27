import { useState, useRef, useEffect } from "react";

interface Line {
  text: string;
  type: "input" | "output" | "error" | "system";
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help        - Show this help",
    "  about       - About Aether Terminal",
    "  whoami      - Display current user",
    "  date        - Show current date/time",
    "  echo <msg>  - Print a message",
    "  clear       - Clear terminal",
    "  ls          - List files",
    "  neofetch    - Display system info",
    "  matrix      - Simulate Matrix rain",
    "  skills      - Show skills",
  ],
  about: ["Aether Terminal v1.0.0", "A web-based terminal emulator.", "Built with React + TypeScript.", "Part of the NexusInfinity ecosystem."],
  whoami: ["guest@nexusinfinity"],
  date: [new Date().toString()],
  ls: ["Documents/  Projects/  Photos/  README.md  .config"],
  neofetch: [
    "       .---.        guest@aether-terminal",
    "      /     \\       OS: Web Browser",
    "     |   O O |      Host: NexusInfinity",
    "      \\  ~  /       Shell: Aether v1.0",
    "       '---'        Uptime: forever",
  ],
  matrix: ["Initiating Matrix rain simulation... (refresh to stop)"],
  skills: [
    "  ⚡ React ............ 95%",
    "  ⚡ TypeScript ....... 92%",
    "  ⚡ Node.js ......... 88%",
    "  ⚡ Rust ............ 70%",
    "  ⚡ GraphQL ......... 82%",
  ],
};

export default function App() {
  const [lines, setLines] = useState<Line[]>([
    { text: "Aether Terminal v1.0.0 — Type 'help' to get started.", type: "system" },
    { text: "", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function processCommand(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const newLines: Line[] = [...lines, { text: `$ ${trimmed}`, type: "input" }];

    if (trimmed === "clear") {
      setLines([{ text: "Terminal cleared.", type: "system" }, { text: "", type: "output" }]);
      return;
    }

    if (trimmed === "matrix") {
      setLines([...newLines, { text: "Dropping into Matrix... (type 'exit' to return)", type: "system" }]);
      let count = 0;
      const interval = setInterval(() => {
        if (count > 40) {
          clearInterval(interval);
          return;
        }
        setLines((prev) => [...prev, {
          text: Array.from({ length: 60 }, () =>
            String.fromCharCode(0x30A0 + Math.random() * 96)
          ).join(""),
          type: "output",
        }]);
        count++;
      }, 80);
      return;
    }

    if (trimmed.startsWith("echo ")) {
      newLines.push({ text: trimmed.slice(5), type: "output" });
    } else if (COMMANDS[trimmed]) {
      COMMANDS[trimmed].forEach((t) => newLines.push({ text: t, type: "output" }));
    } else {
      newLines.push({ text: `Command not found: ${trimmed}`, type: "error" });
    }

    setLines(newLines);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = historyIdx === -1 ? history.length - 1 : historyIdx - 1;
      if (idx >= 0) {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = historyIdx + 1;
      if (idx < history.length) {
        setHistoryIdx(idx);
        setInput(history[idx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  }

  return (
    <div style={styles.terminal} onClick={() => inputRef.current?.focus()}>
      <div style={styles.titleBar}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ ...styles.dot, background: "#ff5f56" }}></div>
          <div style={{ ...styles.dot, background: "#ffbd2e" }}></div>
          <div style={{ ...styles.dot, background: "#27c93f" }}></div>
        </div>
        <span style={{ fontSize: 12, color: "var(--gray)" }}>guest@aether-terminal ~ $</span>
        <div></div>
      </div>

      <div style={styles.body}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              ...styles.line,
              color:
                line.type === "error"
                  ? "#ff4d6a"
                  : line.type === "system"
                    ? "var(--cyan)"
                    : line.type === "input"
                      ? "#fff"
                      : "var(--text)",
              opacity: line.text ? 1 : 0,
            }}
          >
            <span>{line.text || "\u00A0"}</span>
          </div>
        ))}

        <div style={styles.inputLine}>
          <span style={{ color: "var(--green)" }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
            spellCheck={false}
            autoFocus
          />
        </div>

        <div ref={endRef} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  terminal: {
    maxWidth: 800,
    margin: "40px auto",
    background: "var(--bg-card)",
    border: "1px solid rgba(0, 240, 255, 0.15)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(0, 240, 255, 0.05)",
    cursor: "text",
    height: "calc(100vh - 80px)",
    display: "flex",
    flexDirection: "column",
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
  },
  body: {
    flex: 1,
    padding: "20px",
    overflow: "auto",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 14,
    lineHeight: 1.6,
  },
  line: {
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-all" as const,
  },
  inputLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 14,
    fontFamily: "JetBrains Mono, monospace",
    outline: "none",
    caretColor: "var(--cyan)",
  },
};
