import { useState } from "react";

const SCHEMA = `type Query {
  users: [User!]!
  user(id: ID!): User
  projects: [Project!]!
  analytics(dateRange: DateRange!): Analytics
}

type Mutation {
  createUser(input: UserInput!): User!
  updateProject(id: ID!, input: ProjectInput!): Project!
}

type User {
  id: ID!
  name: String!
  email: String!
  role: String!
  projects: [Project!]!
}

type Project {
  id: ID!
  name: String!
  status: ProjectStatus!
  createdAt: String!
}

enum ProjectStatus { ACTIVE ARCHIVED DRAFT }

input DateRange { start: String! end: String! }
input UserInput { name: String! email: String! role: String }
input ProjectInput { name: String status: ProjectStatus }`;

const MOCK_RESPONSES: Record<string, object> = {
  "{ users { id name email role } }": {
    data: {
      users: [
        { id: "1", name: "Alice Chen", email: "alice@example.com", role: "admin" },
        { id: "2", name: "Bob Martinez", email: "bob@example.com", role: "developer" },
        { id: "3", name: "Carol Smith", email: "carol@example.com", role: "viewer" },
      ],
    },
  },
  "{ user(id: \"1\") { id name projects { name status } } }": {
    data: {
      user: { id: "1", name: "Alice Chen", projects: [{ name: "Nebula", status: "ACTIVE" }, { name: "Quantum Forge", status: "ACTIVE" }] },
    },
  },
  "{ projects { id name status createdAt } }": {
    data: {
      projects: [
        { id: "p1", name: "Nebula Dashboard", status: "ACTIVE", createdAt: "2024-08-15" },
        { id: "p2", name: "Quantum Forge", status: "ACTIVE", createdAt: "2024-09-01" },
        { id: "p3", name: "CyberVault", status: "DRAFT", createdAt: "2024-09-20" },
      ],
    },
  },
};

const EXAMPLE_QUERIES = Object.keys(MOCK_RESPONSES);

export default function App() {
  const [query, setQuery] = useState(`{
  users {
    id
    name
    email
    role
  }
}`);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function executeQuery() {
    setLoading(true);
    setError(null);
    setResponse(null);

    const start = performance.now();
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

    const cleaned = query.replace(/\s+/g, " ").trim();
    const mockResponse = MOCK_RESPONSES[cleaned];

    if (mockResponse) {
      setResponse(JSON.stringify(mockResponse, null, 2));
      setLatency(Math.round(performance.now() - start));
    } else {
      setResponse(JSON.stringify({
        data: {
          _generated: true,
          message: "This is a simulated response. In production, Nova API would process this query.",
          query: cleaned,
        },
      }, null, 2));
      setLatency(Math.round(performance.now() - start));
    }
    setLoading(false);
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <span style={{ color: "var(--purple)" }}>◆</span> Nova API
          </h1>
          <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 4 }}>
            GraphQL API Gateway — Playground
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {EXAMPLE_QUERIES.map((eq) => (
            <button
              key={eq}
              onClick={() => setQuery(eq)}
              style={{
                ...styles.exampleBtn,
                ...(query === eq ? { borderColor: "var(--cyan)", color: "var(--cyan)" } : {}),
              }}
            >
              {eq.length > 30 ? eq.slice(0, 30) + "..." : eq}
            </button>
          ))}
        </div>
      </header>

      <div style={styles.panels}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={{ color: "var(--cyan)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Query</span>
            <button onClick={executeQuery} disabled={loading} style={styles.runBtn}>
              {loading ? "Running..." : "▶ Run"}
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.editor}
            spellCheck={false}
          />
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={{ color: "var(--green)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Response {response ? `(${latency}ms)` : ""}
            </span>
          </div>
          <pre style={styles.response}>
            {loading && <span style={{ color: "var(--gray)" }}>Executing query...</span>}
            {error && <span style={{ color: "#ff4d6a" }}>{error}</span>}
            {response && !loading && <code>{response}</code>}
            {!response && !loading && (
              <span style={{ color: "var(--gray)" }}>Run a query to see the response</span>
            )}
          </pre>
        </div>
      </div>

      <div style={styles.schemaPanel}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Schema (SDL)</span>
        </div>
        <pre style={styles.schema}>{SCHEMA}</pre>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 24px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "Orbitron, sans-serif",
    fontWeight: 700,
    color: "#fff",
  },
  exampleBtn: {
    padding: "6px 14px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--gray)",
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "JetBrains Mono, monospace",
    whiteSpace: "nowrap" as const,
  },
  panels: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    flex: 1,
    minHeight: 400,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    overflow: "hidden",
    backdropFilter: "blur(12px)",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
    background: "rgba(0,0,0,0.15)",
  },
  runBtn: {
    padding: "6px 18px",
    background: "linear-gradient(135deg, var(--cyan), var(--purple))",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  editor: {
    flex: 1,
    padding: 16,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 13,
    fontFamily: "JetBrains Mono, monospace",
    lineHeight: 1.6,
    resize: "none" as const,
    outline: "none",
  },
  response: {
    flex: 1,
    padding: 16,
    margin: 0,
    fontSize: 13,
    fontFamily: "JetBrains Mono, monospace",
    lineHeight: 1.6,
    color: "var(--green)",
    overflow: "auto",
    whiteSpace: "pre-wrap" as const,
  },
  schemaPanel: {
    marginTop: 16,
    padding: 16,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    backdropFilter: "blur(12px)",
    maxHeight: 200,
    overflow: "auto",
  },
  schema: {
    margin: 0,
    fontSize: 12,
    fontFamily: "JetBrains Mono, monospace",
    lineHeight: 1.6,
    color: "var(--gray)",
  },
};
