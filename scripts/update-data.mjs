import { mkdir, writeFile } from "node:fs/promises";

const DAYS = 365;
const tradeSource = "https://raw.githubusercontent.com/TattooedHead/house-stock-watcher-data/main/data/all_transactions.json";
const newsFeeds = [
  {
    id: "google-disclosures",
    source: "PUBLIC NEWS",
    url: "https://news.google.com/rss/search?q=congressional+stock+trades+OR+government+official+financial+disclosure&hl=en-US&gl=US&ceid=US:en"
  },
  { id: "sec-releases", source: "SEC", url: "https://www.sec.gov/news/pressreleases.rss" },
  { id: "white-house-news", source: "WHITE HOUSE", url: "https://www.whitehouse.gov/news/feed/" },
  {
    id: "google-deals",
    source: "PUBLIC NEWS",
    url: "https://news.google.com/rss/search?q=%22trade+deal%22+OR+%22deal+talks%22+OR+%22merger+offer%22+OR+%22acquisition+offer%22+OR+%22potential+deal%22&hl=en-US&gl=US&ceid=US:en"
  }
];

function dateOnly(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : text.slice(0, 10);
}

function cutoffDate() {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - DAYS);
  return cutoff.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return String(value || "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim();
}

function parseXmlItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const item = match[1];
    const read = (tag) => escapeXml(item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]);
    return { title: read("title"), link: read("link"), description: read("description"), pubDate: read("pubDate") };
  });
}

function categoryFor(text) {
  const value = text.toLowerCase();
  if (value.includes("ethic") || value.includes("disclosure") || value.includes("filing")) return "Government";
  if (value.includes("policy") || value.includes("congress") || value.includes("senate") || value.includes("house")) return "Policy & markets";
  return "Markets";
}

function sourceFor(title, fallback) {
  const match = title.match(/ - ([^-]+)$/);
  return match ? match[1].trim().toUpperCase() : fallback;
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

async function main() {
  const cutoff = cutoffDate();
  const [tradeResponse, feedResults] = await Promise.all([
    fetch(tradeSource),
    Promise.all(newsFeeds.map(async (feed) => {
      try {
        const response = await fetch(feed.url);
        if (!response.ok) throw new Error(`Feed returned ${response.status}`);
        return parseXmlItems(await response.text()).map((item, index) => ({ ...item, feed, index }));
      } catch (error) {
        console.warn(`[TradeTracker] ${feed.id} feed unavailable: ${error.message}`);
        return [];
      }
    }))
  ]);
  if (!tradeResponse.ok) throw new Error(`Trade source returned ${tradeResponse.status}`);
  const rawNews = feedResults.flat();
  if (rawNews.length === 0) throw new Error("All news feeds are unavailable or empty");

  const rawTrades = await tradeResponse.json();
  const trades = rawTrades.filter((item) => dateOnly(item.transaction_date || item.transactionDate) >= cutoff).map((item) => {
    const official = item.representative || item.member || item.owner || "Unknown official";
    const type = String(item.type || item.transaction_type || "").toLowerCase().includes("sale") ? "Sale" : "Purchase";
    const amount = Number(item.amount_mid || item.amount || 0);
    const state = String(item.district || "").match(/^[A-Z]{2}/)?.[0] || "";
    return {
      official,
      party: item.party || "Unknown",
      state,
      employment: "current",
      ticker: item.ticker || item.asset_description || "—",
      asset: item.asset_description || item.asset || item.ticker || "Unspecified asset",
      type,
      range: item.amount || "Not reported",
      amount,
      transactionDate: dateOnly(item.transaction_date || item.transactionDate),
      disclosureDate: item.disclosure_date || item.disclosureDate || "",
      status: "Verified",
      initials: initials(official),
      sourceUrl: item.source_url || "https://disclosures-clerk.house.gov/FinancialDisclosure"
    };
  }).filter((item) => item.transactionDate);

  const newsByUrl = new Map();
  rawNews.forEach((item) => {
    const date = new Date(item.pubDate);
    if (Number.isNaN(date.getTime())) return;
    const isoDate = date.toISOString().slice(0, 10);
    if (isoDate < cutoff || isoDate > new Date().toISOString().slice(0, 10)) return;
    const article = {
      id: `${item.feed.id}-${date.getTime()}-${item.index}`,
      source: sourceFor(item.title, item.feed.source),
      date: isoDate,
      category: categoryFor(`${item.title} ${item.description}`),
      relevance: Math.max(1, 100 - item.index),
      title: item.title.replace(/ - [^-]+$/, "").trim(),
      summary: item.description || "Publicly available news related to government disclosures and markets.",
      originalUrl: item.link
    };
    const key = article.originalUrl || `${article.date}:${article.title.toLowerCase()}`;
    if (!newsByUrl.has(key)) newsByUrl.set(key, article);
  });
  const news = [...newsByUrl.values()];

  await mkdir("data", { recursive: true });
  await writeFile("data/trades.json", JSON.stringify(trades, null, 2));
  await writeFile("data/news.json", JSON.stringify(news, null, 2));
  await writeFile("data/metadata.json", JSON.stringify({
    generatedAt: new Date().toISOString(),
    coverageStart: cutoff,
    coverageEnd: new Date().toISOString().slice(0, 10),
    tradeCount: trades.length,
    newsCount: news.length,
    tradeSource,
    newsSources: newsFeeds.map((feed) => feed.url)
  }, null, 2));
  console.log(`Generated ${trades.length} trades and ${news.length} news stories covering ${cutoff} onward.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
