/**
 * data-fetcher.js
 * Client-side data pipeline — fetches trade and news data directly from
 * public sources on every page load, on any device, with no server required.
 *
 * Strategy (each source tries in order):
 *   1. Live fetch from the original public source
 *   2. Fallback to the static data/ JSON committed to the repo
 *   3. Fallback to the hardcoded sample data in the calling script
 */

const TRADE_SOURCE =
  "https://raw.githubusercontent.com/TattooedHead/house-stock-watcher-data/main/data/all_transactions.json";

// allorigins.win wraps the response in { contents: "..." } and adds CORS headers
const NEWS_RSS =
  "https://news.google.com/rss/search?q=congressional+stock+trades+OR+government+official+financial+disclosure&hl=en-US&gl=US&ceid=US:en";
const NEWS_PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(NEWS_RSS)}`;

const DAYS = 365;

// ─── helpers ────────────────────────────────────────────────────────────────

function cutoffDate() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - DAYS);
  return d.toISOString().slice(0, 10);
}

function dateOnly(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : text.slice(0, 10);
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function escapeXml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function parseXmlItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const item = m[1];
    const read = (tag) =>
      escapeXml(
        item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]
      );
    return {
      title: read("title"),
      link: read("link"),
      description: read("description"),
      pubDate: read("pubDate"),
    };
  });
}

function categoryFor(text) {
  const v = text.toLowerCase();
  if (v.includes("ethic") || v.includes("disclosure") || v.includes("filing"))
    return "Government";
  if (
    v.includes("policy") ||
    v.includes("congress") ||
    v.includes("senate") ||
    v.includes("house")
  )
    return "Policy & markets";
  return "Markets";
}

function sourceFor(title) {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim().toUpperCase() : "PUBLIC NEWS";
}

// ─── trades ─────────────────────────────────────────────────────────────────

/**
 * Fetch and normalise trades from the live source.
 * Returns { trades: [...], source: "live" | "cached" | "sample" }
 */
async function fetchTrades() {
  const cutoff = cutoffDate();

  // 1. Try live source
  try {
    const res = await fetch(TRADE_SOURCE, { cache: "no-store" });
    if (!res.ok) throw new Error(`Source returned ${res.status}`);
    const raw = await res.json();
    const trades = normaliseTrades(raw, cutoff);
    if (trades.length > 0) return { trades, source: "live", fetchedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[TradeTracker] Live trade fetch failed, trying cache.", err.message);
  }

  // 2. Try static fallback in repo
  try {
    const res = await fetch("data/trades.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Cache returned ${res.status}`);
    const trades = await res.json();
    return { trades, source: "cached", fetchedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[TradeTracker] Cached trade file unavailable.", err.message);
  }

  // 3. Caller provides sample data
  return { trades: null, source: "sample", fetchedAt: new Date().toISOString() };
}

function normaliseTrades(raw, cutoff) {
  return raw
    .map((item) => {
      const txDate = dateOnly(item.transaction_date || item.transactionDate);
      if (!txDate || txDate < cutoff) return null;

      const official =
        item.representative || item.member || item.owner || "Unknown official";
      const type = String(
        item.type || item.transaction_type || ""
      ).toLowerCase().includes("sale")
        ? "Sale"
        : "Purchase";
      const amount = Number(item.amount_mid || item.amount || 0);
      const state =
        String(item.district || "").match(/^[A-Z]{2}/)?.[0] || "";

      return {
        official,
        party: item.party || "Unknown",
        state,
        employment: "current",
        ticker: item.ticker || item.asset_description || "—",
        asset:
          item.asset_description || item.asset || item.ticker || "Unspecified asset",
        type,
        range: item.amount || "Not reported",
        amount,
        transactionDate: txDate,
        disclosureDate: item.disclosure_date || item.disclosureDate || "",
        status: "Verified",
        initials: initials(official),
        sourceUrl:
          item.source_url ||
          "https://disclosures-clerk.house.gov/FinancialDisclosure",
      };
    })
    .filter(Boolean);
}

// ─── news ────────────────────────────────────────────────────────────────────

/**
 * Fetch and normalise news from the live RSS source via CORS proxy.
 * Returns { news: [...], source: "live" | "cached" | "sample" }
 */
async function fetchNews() {
  const cutoff = cutoffDate();

  // 1. Try live RSS via CORS proxy
  try {
    const res = await fetch(NEWS_PROXY, { cache: "no-store" });
    if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
    const { contents } = await res.json();
    if (!contents) throw new Error("Proxy returned empty contents");
    const news = normaliseNews(parseXmlItems(contents), cutoff);
    if (news.length > 0) return { news, source: "live", fetchedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[TradeTracker] Live news fetch failed, trying cache.", err.message);
  }

  // 2. Try static fallback in repo
  try {
    const res = await fetch("data/news.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Cache returned ${res.status}`);
    const news = await res.json();
    return { news, source: "cached", fetchedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[TradeTracker] Cached news file unavailable.", err.message);
  }

  // 3. Caller provides sample data
  return { news: null, source: "sample", fetchedAt: new Date().toISOString() };
}

function normaliseNews(items, cutoff) {
  return items
    .map((item, index) => {
      const date = new Date(item.pubDate);
      if (Number.isNaN(date.getTime())) return null;
      const iso = date.toISOString().slice(0, 10);
      if (iso < cutoff) return null;
      return {
        id: `feed-${date.getTime()}-${index}`,
        source: sourceFor(item.title),
        date: iso,
        category: categoryFor(`${item.title} ${item.description}`),
        relevance: Math.max(1, 100 - index),
        title: item.title.replace(/ - [^-]+$/, "").trim(),
        summary:
          item.description ||
          "Publicly available news related to government disclosures and markets.",
        originalUrl: item.link,
      };
    })
    .filter(Boolean);
}

// ─── exports ─────────────────────────────────────────────────────────────────

window.TradeTrackerData = { fetchTrades, fetchNews };
