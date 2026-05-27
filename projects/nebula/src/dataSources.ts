export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  marketCap: number;
  image?: string;
}

export interface CryptoHistory {
  prices: [number, number][];
}

export interface RepoStats {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string;
  updatedAt: string;
  topics: string[];
}

const CACHE: Record<string, { data: any; expiry: number }> = {};
const CACHE_TTL = 60000; // 1 minute

function cachedFetch<T>(key: string, url: string, ttl = CACHE_TTL): Promise<T> {
  const cached = CACHE[key];
  if (cached && Date.now() < cached.expiry) {
    return Promise.resolve(cached.data as T);
  }
  return fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    })
    .then((data) => {
      CACHE[key] = { data, expiry: Date.now() + ttl };
      return data as T;
    });
}

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function searchCrypto(query: string): Promise<{ id: string; symbol: string; name: string }[]> {
  const data: { coins: { id: string; symbol: string; name: string }[] } = await cachedFetch(
    `cg_search_${query}`,
    `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`
  );
  return (data.coins || []).slice(0, 10);
}

export async function getCryptoPrice(ids: string[]): Promise<Record<string, CryptoAsset>> {
  const data: Record<string, { usd: number; usd_24h_change: number; usd_market_cap: number }> = await cachedFetch(
    `cg_price_${ids.join(",")}`,
    `${COINGECKO_BASE}/simple/price?ids=${ids.join(",")}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
  );
  const result: Record<string, CryptoAsset> = {};
  for (const id of ids) {
    const d = data[id];
    if (d) {
      result[id] = {
        id,
        symbol: id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        currentPrice: d.usd,
        change24h: d.usd_24h_change ?? 0,
        marketCap: d.usd_market_cap ?? 0,
      };
    }
  }
  return result;
}

export async function getCryptoHistory(id: string, days: number): Promise<CryptoHistory> {
  const data: CryptoHistory = await cachedFetch(
    `cg_history_${id}_${days}`,
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    CACHE_TTL * 5
  );
  return data;
}

export async function getRepoStats(repo: string): Promise<RepoStats> {
  const data: any = await cachedFetch(
    `gh_repo_${repo}`,
    `https://api.github.com/repos/${encodeURIComponent(repo)}`,
    CACHE_TTL * 2
  );
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description ?? "",
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    openIssues: data.open_issues_count ?? 0,
    watchers: data.watchers_count ?? 0,
    language: data.language ?? "N/A",
    updatedAt: data.updated_at ?? "",
    topics: data.topics ?? [],
  };
}

export const POPULAR_CRYPTO = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
  { id: "ethereum", symbol: "eth", name: "Ethereum" },
  { id: "solana", symbol: "sol", name: "Solana" },
  { id: "cardano", symbol: "ada", name: "Cardano" },
  { id: "ripple", symbol: "xrp", name: "XRP" },
];

export const EXAMPLE_REPOS = [
  "moosagiesurvey/mi-portfolio",
  "facebook/react",
  "tailwindlabs/tailwindcss",
  "vercel/next.js",
  "astrolabs/astro",
];
