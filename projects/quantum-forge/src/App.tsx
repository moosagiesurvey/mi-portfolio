import { useState } from "react";

interface Snippet {
  title: string;
  language: string;
  code: string;
}

const EXAMPLES = [
  "A React hook that debounces a value",
  "A Python function to parse CSV files",
  "A Node.js Express API endpoint with auth",
  "A CSS grid layout for a dashboard",
];

const FAKE_RESPONSES: Record<string, Snippet> = {
  "A React hook that debounces a value": {
    title: "useDebounce Hook",
    language: "typescript",
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  "A Python function to parse CSV files": {
    title: "CSV Parser",
    language: "python",
    code: `import csv
from typing import List, Dict

def parse_csv(filepath: str, delimiter: str = ",") -> List[Dict[str, str]]:
    """
    Parse a CSV file and return a list of dictionaries.
    """
    results: List[Dict[str, str]] = []
    with open(filepath, "r", newline="") as f:
        reader = csv.DictReader(f, delimiter=delimiter)
        for row in reader:
            results.append(row)
    return results`,
  },
  "A Node.js Express API endpoint with auth": {
    title: "Express Auth Middleware",
    language: "javascript",
    code: `const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});`,
  },
  "A CSS grid layout for a dashboard": {
    title: "Dashboard Grid Layout",
    language: "css",
    code: `.dashboard {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header { grid-area: header; }
.main {
  grid-area: main;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 24px;
}`,
  },
};

export default function App() {
  const [input, setInput] = useState("");
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(false);
  const [typedCode, setTypedCode] = useState("");

  async function handleGenerate(description: string) {
    setInput(description);
    setSnippet(null);
    setTypedCode("");
    setLoading(true);

    const response = FAKE_RESPONSES[description];
    if (!response) {
      setSnippet({
        title: "Generated Module",
        language: "typescript",
        code: `// AI-generated code based on: "${description}"\n// This is a simulated response.\n// In production, this would call a real AI model.\n\nexport function generatedSolution() {\n  // TODO: implement based on requirements\n  return "Solution for: ${description}";\n}`,
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSnippet(response);
      setLoading(false);
      let i = 0;
      const fullCode = response.code;
      const interval = setInterval(() => {
        if (i < fullCode.length) {
          setTypedCode(fullCode.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 8);
    }, 800);
  }

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={{ fontSize: 10, color: "var(--gray)", letterSpacing: "0.2em" }}>⚡ QUANTUM FORGE</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.6, marginBottom: 24 }}>
          Describe what you want to build and the forge generates production-ready code.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleGenerate(ex)}
              style={{
                ...styles.exampleBtn,
                ...(input === ex ? styles.exampleBtnActive : {}),
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input && handleGenerate(input)}
            placeholder="Describe the code you need..."
            style={styles.input}
          />
          <button
            onClick={() => input && handleGenerate(input)}
            disabled={!input || loading}
            style={{
              ...styles.generateBtn,
              opacity: !input || loading ? 0.5 : 1,
            }}
          >
            {loading ? "Generating..." : "Forge →"}
          </button>
        </div>

        {loading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <span style={{ color: "var(--gray)", fontSize: 14 }}>Forging code...</span>
          </div>
        )}

        {snippet && !loading && (
          <div style={styles.output}>
            <div style={styles.outputHeader}>
              <span style={{ color: "var(--cyan)", fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}>
                ▲ {snippet.title}.{snippet.language}
              </span>
              <button onClick={() => navigator.clipboard.writeText(snippet.code)} style={styles.copyBtn}>
                Copy
              </button>
            </div>
            <pre style={styles.codeBlock}>
              <code>{typedCode || snippet.code}</code>
              <span style={styles.cursor}>▊</span>
            </pre>
          </div>
        )}

        {!snippet && !loading && (
          <div style={styles.empty}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <p style={{ color: "var(--gray)", fontSize: 14 }}>
              Select an example or type your own description above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: 300,
    background: "var(--bg-card)",
    borderRight: "1px solid var(--border)",
    padding: "32px 24px",
    flexShrink: 0,
  },
  logo: {
    marginBottom: 24,
  },
  exampleBtn: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    textAlign: "left" as const,
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text)",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "Inter, sans-serif",
  },
  exampleBtnActive: {
    borderColor: "var(--cyan)",
    background: "rgba(0, 240, 255, 0.06)",
  },
  main: {
    flex: 1,
    padding: "32px 40px",
    display: "flex",
    flexDirection: "column",
  },
  inputRow: {
    display: "flex",
    gap: 12,
    marginBottom: 32,
  },
  input: {
    flex: 1,
    padding: "14px 20px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    outline: "none",
  },
  generateBtn: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, var(--cyan), var(--purple))",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap" as const,
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 60,
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2px solid var(--border)",
    borderTopColor: "var(--cyan)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  output: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    overflow: "hidden",
  },
  outputHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid var(--border)",
    background: "rgba(0,0,0,0.2)",
  },
  copyBtn: {
    padding: "4px 12px",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--gray)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  codeBlock: {
    padding: 24,
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: "JetBrains Mono, monospace",
    color: "var(--text)",
    overflow: "auto",
    maxHeight: 500,
    margin: 0,
  },
  cursor: {
    animation: "blink 1s step-end infinite",
    color: "var(--cyan)",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
    textAlign: "center" as const,
  },
};
