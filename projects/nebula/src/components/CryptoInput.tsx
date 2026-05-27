import { useState, useEffect } from "react";
import { searchCrypto, getCryptoPrice, getCryptoHistory, POPULAR_CRYPTO } from "../dataSources";
import type { CryptoAsset, CryptoHistory } from "../dataSources";

export default function CryptoInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; symbol: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [price, setPrice] = useState<CryptoAsset | null>(null);
  const [history, setHistory] = useState<CryptoHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const coins = await searchCrypto(query);
        setResults(coins);
      } catch { setResults([]); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  async function selectAsset(id: string, name: string) {
    setSelected(name);
    setQuery("");
    setResults([]);
    setLoading(true);
    setError(null);
    try {
      const prices = await getCryptoPrice([id]);
      const asset = prices[id];
      if (asset) {
        asset.name = name;
        setPrice(asset);
      }
      const hist = await getCryptoHistory(id, 7);
      setHistory(hist);
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--cyan)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Crypto Market Data
      </h3>
      <p style={{ fontSize: 12, color: "var(--gray)", marginBottom: 16, lineHeight: 1.6 }}>
        Search any cryptocurrency by name or symbol. Data sourced from <strong style={{ color: "#fff" }}>CoinGecko</strong> — no API key needed.
      </p>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crypto (e.g. Bitcoin, ETH, SOL)"
          style={{
            width: "100%", padding: "10px 14px", background: "rgba(0,0,0,0.3)",
            border: "1px solid var(--border)", borderRadius: 10, color: "#fff",
            fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
          }}
        />
        {results.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "#111", border: "1px solid var(--border)", borderRadius: 10,
            zIndex: 10, marginTop: 4, maxHeight: 200, overflow: "auto",
          }}>
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => selectAsset(r.id, r.name)}
                style={{
                  display: "block", width: "100%", padding: "10px 14px",
                  background: "transparent", border: "none", borderBottom: "1px solid var(--border)",
                  color: "#d0d0f0", fontSize: 13, textAlign: "left", cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <strong>{r.name}</strong> <span style={{ color: "var(--gray)" }}>({r.symbol})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
        {POPULAR_CRYPTO.map((c) => (
          <button
            key={c.id}
            onClick={() => selectAsset(c.id, c.name)}
            style={{
              padding: "4px 12px", background: selected === c.name ? "rgba(0,240,255,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${selected === c.name ? "rgba(0,240,255,0.3)" : "var(--border)"}`,
              borderRadius: 6, color: selected === c.name ? "var(--cyan)" : "var(--gray)",
              fontSize: 11, cursor: "pointer", fontFamily: "Inter, sans-serif",
            }}
          >
            {c.symbol.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <div style={{ color: "var(--gray)", fontSize: 13 }}>Loading...</div>}
      {error && <div style={{ color: "#ff4d6a", fontSize: 13, marginBottom: 8 }}>{error}</div>}

      {price && (
        <div style={{
          background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 16, marginBottom: 16,
          border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{price.name}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Orbitron, sans-serif" }}>
              ${price.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12, color: "var(--gray)" }}>
            <span>24h: <span style={{ color: price.change24h >= 0 ? "#00f0ff" : "#ff4d6a" }}>
              {price.change24h >= 0 ? "+" : ""}{price.change24h.toFixed(2)}%
            </span></span>
            <span>Market Cap: ${(price.marketCap / 1e9).toFixed(2)}B</span>
          </div>
        </div>
      )}

      {history && history.prices.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "var(--gray)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            7-Day Price History
          </div>
          <div style={{
            background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 12,
            height: 120, position: "relative", border: "1px solid var(--border)",
          }}>
            <svg width="100%" height="100%" viewBox="0 0 700 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="crypto-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = history.prices;
                const min = Math.min(...pts.map((p) => p[1]));
                const max = Math.max(...pts.map((p) => p[1]));
                const range = max - min || 1;
                const points = pts.map((p, i) => {
                  const x = (i / (pts.length - 1)) * 700;
                  const y = 100 - ((p[1] - min) / range) * 90 - 5;
                  return `${x},${y}`;
                });
                const poly = `M0,100 L${points.join(" L")} L700,100 Z`;
                return (
                  <>
                    <polyline fill="none" stroke="#00f0ff" strokeWidth="1.5" points={points.join(" ")} />
                    <path fill="url(#crypto-fill)" d={poly} />
                  </>
                );
              })()}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--gray)", marginTop: 4 }}>
            <span>{new Date(history.prices[0][0]).toLocaleDateString()}</span>
            <span>{new Date(history.prices[history.prices.length - 1][0]).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      <div style={{
        marginTop: 20, padding: 14, background: "rgba(0, 240, 255, 0.03)",
        border: "1px solid rgba(0, 240, 255, 0.1)", borderRadius: 10, fontSize: 11,
        color: "var(--gray)", lineHeight: 1.7,
      }}>
        <strong style={{ color: "#fff" }}>How to use:</strong><br />
        1. Search a crypto name or symbol in the field above<br />
        2. Click a result or one of the quick-select buttons<br />
        3. View live price, 24h change, market cap + 7-day chart<br />
        Data refreshes every 60s. Powered by{" "}
        <a href="https://www.coingecko.com/" target="_blank" rel="noopener" style={{ color: "var(--cyan)" }}>
          CoinGecko
        </a>
        .
      </div>
    </div>
  );
}
