import { useState } from "react";
import { getRepoStats, EXAMPLE_REPOS } from "../dataSources";
import type { RepoStats } from "../dataSources";

export default function GitHubInput() {
  const [repo, setRepo] = useState("");
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRepo(r: string) {
    const cleaned = r.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
    if (!cleaned || !cleaned.includes("/")) {
      setError("Enter a repo in format: owner/repo");
      return;
    }
    setRepo(cleaned);
    setLoading(true);
    setError(null);
    try {
      const data = await getRepoStats(cleaned);
      setStats(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch. Try a public repo.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--cyan)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        GitHub Repo Stats
      </h3>
      <p style={{ fontSize: 12, color: "var(--gray)", marginBottom: 16, lineHeight: 1.6 }}>
        Enter any public GitHub repo to see stars, forks, and activity. No API key needed (60 req/hr limit).
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchRepo(repo)}
          placeholder="owner/repo (e.g. facebook/react)"
          style={{
            flex: 1, padding: "10px 14px", background: "rgba(0,0,0,0.3)",
            border: "1px solid var(--border)", borderRadius: 10, color: "#fff",
            fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
          }}
        />
        <button
          onClick={() => fetchRepo(repo)}
          disabled={loading || !repo}
          style={{
            padding: "10px 20px",
            background: !repo ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, var(--cyan), var(--purple))",
            border: "none", borderRadius: 10, color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: !repo ? "default" : "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          {loading ? "..." : "Fetch"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
        {EXAMPLE_REPOS.map((r) => (
          <button
            key={r}
            onClick={() => { setRepo(r); fetchRepo(r); }}
            style={{
              padding: "4px 12px", background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)", borderRadius: 6, color: "var(--gray)",
              fontSize: 11, cursor: "pointer", fontFamily: "monospace",
            }}
          >
            {r.split("/")[1]}
          </button>
        ))}
      </div>

      {error && <div style={{ color: "#ff4d6a", fontSize: 12, marginBottom: 8 }}>{error}</div>}

      {stats && (
        <div style={{
          background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 16,
          border: "1px solid var(--border)",
        }}>
          <div style={{ marginBottom: 12 }}>
            <a
              href={`https://github.com/${stats.fullName}`}
              target="_blank" rel="noopener"
              style={{ fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none" }}
            >
              {stats.fullName}
            </a>
            {stats.description && (
              <p style={{ fontSize: 12, color: "var(--gray)", marginTop: 4, lineHeight: 1.5 }}>
                {stats.description}
              </p>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ textAlign: "center", padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "Orbitron, sans-serif" }}>★ {stats.stars.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>Stars</div>
            </div>
            <div style={{ textAlign: "center", padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "Orbitron, sans-serif" }}>⑂ {stats.forks.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>Forks</div>
            </div>
            <div style={{ textAlign: "center", padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ff4d6a", fontFamily: "Orbitron, sans-serif" }}>! {stats.openIssues}</div>
              <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2 }}>Issues</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--gray)" }}>
            <span>Language: <strong style={{ color: "#d0d0f0" }}>{stats.language}</strong></span>
            <span>Updated: {new Date(stats.updatedAt).toLocaleDateString()}</span>
          </div>

          {stats.topics.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
              {stats.topics.slice(0, 6).map((t) => (
                <span key={t} style={{
                  padding: "2px 8px", background: "rgba(0, 240, 255, 0.08)",
                  border: "1px solid rgba(0, 240, 255, 0.15)", borderRadius: 4,
                  fontSize: 10, color: "var(--cyan)",
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: 20, padding: 14, background: "rgba(0, 240, 255, 0.03)",
        border: "1px solid rgba(0, 240, 255, 0.1)", borderRadius: 10, fontSize: 11,
        color: "var(--gray)", lineHeight: 1.7,
      }}>
        <strong style={{ color: "#fff" }}>How to use:</strong><br />
        1. Enter a GitHub repo in <strong style={{ color: "#d0d0f0" }}>owner/repo</strong> format<br />
        2. Click &quot;Fetch&quot; or press Enter<br />
        3. See stars, forks, open issues, language, topics<br />
        Rate limit: 60 unauthenticated requests/hour. Powered by{" "}
        <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener" style={{ color: "var(--cyan)" }}>
          GitHub REST API
        </a>.
      </div>
    </div>
  );
}
