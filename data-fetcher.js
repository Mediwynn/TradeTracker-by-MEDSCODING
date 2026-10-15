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

const NEWS_FEEDS = [
  {
    id: "google-disclosures",
    source: "PUBLIC NEWS",
    url: "https://news.google.com/rss/search?q=congressional+stock+trades+OR+government+official+financial+disclosure&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "sec-releases",
    source: "SEC",
    url: "https://www.sec.gov/news/pressreleases.rss",
  },
  {
    id: "white-house-news",
    source: "WHITE HOUSE",
    url: "https://www.whitehouse.gov/news/feed/",
  },
  {
    id: "google-deals",
    source: "PUBLIC NEWS",
    url: "https://news.google.com/rss/search?q=%22trade+deal%22+OR+%22deal+talks%22+OR+%22merger+offer%22+OR+%22acquisition+offer%22+OR+%22potential+deal%22&hl=en-US&gl=US&ceid=US:en",
  },
];
// rss2json.com converts RSS to JSON with CORS headers.
const NEWS_PROXY_PRIMARY = "https://api.rss2json.com/v1/api.json?rss_url=";
// allorigins.win wraps the original RSS XML in { contents: "..." }.
const NEWS_PROXY_FALLBACK = "https://api.allorigins.win/get?url=";

const DAYS = 365;
const SIGNED_OUT_DELAY_DAYS = 150;
const GUEST_TRADE_LIMIT = 10;
const GUEST_NEWS_LIMIT = 12;

// ─── helpers ────────────────────────────────────────────────────────────────

function cutoffDate() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - DAYS);
  return d.toISOString().slice(0, 10);
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days - 1);
  return date.toISOString().slice(0, 10);
}

function parseDisclosureDate(value) {
  const text = String(value || "").trim();
  const usDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usDate) return `${usDate[3]}-${usDate[1].padStart(2, "0")}-${usDate[2].padStart(2, "0")}`;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

async function getDataAccess() {
  let authenticated = false;
  try {
    const { hasAuthenticatedSession } = await import("./auth-state.js");
    authenticated = await hasAuthenticatedSession();
  } catch (error) {
    console.error("[TradeTracker] Could not verify the account session; using delayed public data.", error);
  }
  const guest = window.TradeTrackerGuest.isGuestMode();
  return {
    authenticated,
    guest,
    delayed: !authenticated,
    latestDate: authenticated ? new Date().toISOString().slice(0, 10) : dateDaysAgo(SIGNED_OUT_DELAY_DAYS),
  };
}

function isTradeVisible(trade, access) {
  if (!access.delayed) return true;
  const disclosureDate = parseDisclosureDate(trade.disclosureDate || trade.disclosure_date);
  return Boolean(disclosureDate && disclosureDate <= access.latestDate);
}

function filterTradesByAccess(trades, access) {
  return trades.filter((trade) => isTradeVisible(trade, access));
}

function filterNewsByAccess(news, access) {
  if (!access.delayed) return news;
  return news.filter((item) => item.date && item.date <= access.latestDate);
}

function dateOnly(value) {
  return parseDisclosureDate(value);
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

function sourceFor(title, fallback) {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim().toUpperCase() : fallback;
}

// ─── trades ─────────────────────────────────────────────────────────────────

/**
 * Fetch and normalise trades from the live source.
 * Returns { trades: [...], source: "live" | "cached" | "sample" }
 */
async function fetchTrades() {
  const cutoff = cutoffDate();
  const access = await getDataAccess();
  if (access.guest) {
    try {
      const [tradeResponse, metadata] = await Promise.all([
        fetch("data/trades.json", { cache: "no-store" }),
        fetchSnapshotMetadata(),
      ]);
      if (!tradeResponse.ok) throw new Error(`Cached trades returned ${tradeResponse.status}`);
      const cachedTrades = await tradeResponse.json();
      return {
        trades: filterTradesByAccess(cachedTrades, access)
          .sort((a, b) => String(b.transactionDate).localeCompare(String(a.transactionDate)))
          .slice(0, GUEST_TRADE_LIMIT),
        source: "guest",
        limited: true,
        access,
        snapshotAt: metadata?.generatedAt || null,
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error("[TradeTracker] Guest trade snapshot is unavailable.", err);
      return { trades: [], source: "guest", limited: true, access, snapshotAt: null, fetchedAt: new Date().toISOString() };
    }
  }

  // 1. Try live source
  try {
    const res = await fetch(TRADE_SOURCE, { cache: "no-store" });
    if (!res.ok) throw new Error(`Source returned ${res.status}`);
    const raw = await res.json();
    const trades = normaliseTrades(raw, cutoff, access);
    if (trades.length > 0) return { trades, source: "live", access, fetchedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[TradeTracker] Live trade fetch failed, trying cache.", err.message);
  }

  // 2. Try static fallback in repo
  try {
    const res = await fetch("data/trades.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Cache returned ${res.status}`);
    const trades = filterTradesByAccess(await res.json(), access);
    return { trades, source: "cached", access, fetchedAt: new Date().toISOString() };
  } catch (err) {
    console.warn("[TradeTracker] Cached trade file unavailable.", err.message);
  }

  // 3. Caller provides sample data
  return { trades: null, source: "sample", access, fetchedAt: new Date().toISOString() };
}

function normaliseTrades(raw, cutoff, access) {
  const today = new Date().toISOString().slice(0, 10);
  return raw
    .map((item) => {
      const txDate = dateOnly(item.transaction_date || item.transactionDate);
      if (!txDate || txDate < cutoff || txDate > today) return null; // reject missing, too old, or future-dated
      const disclosureDate = parseDisclosureDate(item.disclosure_date || item.disclosureDate);
      if (access.delayed && (!disclosureDate || disclosureDate > access.latestDate)) return null;

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
        disclosureDate,
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
 * Fetch and combine news from live RSS sources via CORS proxies.
 * Returns { news: [...], source: "live" | "cached" | "sample" }
 */
async function fetchNews() {
  const cutoff = cutoffDate();
  const access = await getDataAccess();
  if (access.guest) {
    try {
      const [newsResponse, metadata] = await Promise.all([
        fetch("data/news.json", { cache: "no-store" }),
        fetchSnapshotMetadata(),
      ]);
      if (!newsResponse.ok) throw new Error(`Cached news returned ${newsResponse.status}`);
      const cachedNews = await newsResponse.json();
      return {
        news: filterNewsByAccess(cachedNews, access)
          .sort((a, b) => String(b.date).localeCompare(String(a.date)))
          .slice(0, GUEST_NEWS_LIMIT),
        source: "guest",
        limited: true,
        access,
        snapshotAt: metadata?.generatedAt || null,
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error("[TradeTracker] Guest news snapshot is unavailable.", err);
      return { news: [], source: "guest", limited: true, access, snapshotAt: null, fetchedAt: new Date().toISOString() };
    }
  }
  const feedResults = await Promise.all(NEWS_FEEDS.map(async (feed) => {
    try {
      return await fetchNewsFeed(feed, cutoff, access);
    } catch (err) {
      console.warn(`[TradeTracker] ${feed.id} feed unavailable.`, err.message);
      return [];
    }
  }));
  const uniqueNews = new Map();
  feedResults.flat().forEach((item) => {
    const key = item.originalUrl || `${item.date}:${item.title.toLowerCase()}`;
    if (!uniqueNews.has(key)) uniqueNews.set(key, item);
  });
  const liveNews = [...uniqueNews.values()];

  // Supplement live feeds with previously gathered stories when available.
  try {
    const res = await fetch("data/news.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Cache returned ${res.status}`);
    const cachedNews = filterNewsByAccess(await res.json(), access);
    const combined = new Map();
    [...liveNews, ...cachedNews].forEach((item) => {
      const key = item.originalUrl || `${item.date}:${item.title.toLowerCase()}`;
      if (!combined.has(key)) combined.set(key, item);
    });
    if (combined.size > 0) {
      return {
        news: [...combined.values()],
        source: liveNews.length > 0 ? "live" : "cached",
        access,
        fetchedAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    if (liveNews.length === 0) {
      console.warn("[TradeTracker] Cached news file unavailable.", err.message);
    }
  }
  if (liveNews.length > 0) {
    return { news: liveNews, source: "live", access, fetchedAt: new Date().toISOString() };
  }

  // 3. Caller provides sample data
  return { news: null, source: "sample", access, fetchedAt: new Date().toISOString() };
}

async function fetchSnapshotMetadata() {
  try {
    const response = await fetch("data/metadata.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Snapshot metadata returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("[TradeTracker] Snapshot date could not be loaded.", error);
    return null;
  }
}

async function fetchNewsFeed(feed, cutoff, access) {
  try {
    const res = await fetch(`${NEWS_PROXY_PRIMARY}${encodeURIComponent(feed.url)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`rss2json returned ${res.status}`);
    const json = await res.json();
    if (json.status !== "ok" || !Array.isArray(json.items)) throw new Error("rss2json bad response");
    return normaliseNews(json.items, cutoff, feed.source, feed.id, access);
  } catch (primaryError) {
    console.warn(`[TradeTracker] rss2json failed for ${feed.id}; trying allorigins.`, primaryError.message);
  }

  const res = await fetch(`${NEWS_PROXY_FALLBACK}${encodeURIComponent(feed.url)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`allorigins returned ${res.status}`);
  const { contents } = await res.json();
  if (!contents) throw new Error("allorigins returned empty contents");
  return normaliseNews(parseXmlItems(contents), cutoff, feed.source, feed.id, access);
}

function normaliseNews(items, cutoff, fallbackSource, feedId, access) {
  return items
    .map((item, index) => {
      const date = new Date(item.pubDate);
      if (Number.isNaN(date.getTime())) return null;
      const iso = date.toISOString().slice(0, 10);
      if (iso < cutoff || iso > access.latestDate) return null;
      return {
        id: `${feedId}-${date.getTime()}-${index}`,
        source: sourceFor(item.title || "", fallbackSource),
        date: iso,
        category: categoryFor(`${item.title || ""} ${item.description || ""}`),
        relevance: Math.max(1, 100 - index),
        title: (item.title || "").replace(/ - [^-]+$/, "").trim(),
        summary:
          item.description ||
          "Publicly available news related to government disclosures and markets.",
        originalUrl: item.link,
      };
    })
    .filter(Boolean);
}

// ─── exports ─────────────────────────────────────────────────────────────────

window.TradeTrackerData = { fetchTrades, fetchNews, filterTradesByAccess, filterNewsByAccess, getDataAccess };
