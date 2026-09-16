const sampleTrades = [
  { official: "Maya Chen", party: "Democrat", state: "CA", employment: "current", ticker: "NVDA", asset: "NVIDIA Corp.", type: "Purchase", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-09-12", disclosureDate: "Sep 14, 2026", status: "Verified", initials: "MC" },
  { official: "Thomas Reed", party: "Republican", state: "OH", employment: "current", ticker: "LMT", asset: "Lockheed Martin", type: "Purchase", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-09-11", disclosureDate: "Sep 13, 2026", status: "Verified", initials: "TR" },
  { official: "Elena Martinez", party: "Democrat", state: "NY", employment: "former", ticker: "MSFT", asset: "Microsoft Corp.", type: "Sale", range: "$50,001 – $100,000", amount: 75000, transactionDate: "2026-09-10", disclosureDate: "Sep 13, 2026", status: "Under review", initials: "EM" },
  { official: "James Whitfield", party: "Republican", state: "TX", employment: "current", ticker: "XOM", asset: "Exxon Mobil", type: "Sale", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-09-10", disclosureDate: "Sep 12, 2026", status: "Verified", initials: "JW" },
  { official: "Priya Shah", party: "Democrat", state: "IL", employment: "current", ticker: "AMD", asset: "Advanced Micro Devices", type: "Purchase", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-09-09", disclosureDate: "Sep 12, 2026", status: "Verified", initials: "PS" },
  { official: "Robert Hayes", party: "Republican", state: "FL", employment: "former", ticker: "JPM", asset: "JPMorgan Chase", type: "Purchase", range: "$50,001 – $100,000", amount: 75000, transactionDate: "2026-09-08", disclosureDate: "Sep 11, 2026", status: "Verified", initials: "RH" },
  { official: "Alicia Brooks", party: "Democrat", state: "MA", employment: "current", ticker: "GOOGL", asset: "Alphabet Inc.", type: "Sale", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-09-08", disclosureDate: "Sep 10, 2026", status: "Verified", initials: "AB" },
  { official: "Daniel Kim", party: "Republican", state: "GA", employment: "current", ticker: "RTX", asset: "RTX Corporation", type: "Purchase", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-09-07", disclosureDate: "Sep 10, 2026", status: "Under review", initials: "DK" },
  { official: "Sofia Patel", party: "Democrat", state: "WA", employment: "current", ticker: "AMZN", asset: "Amazon.com Inc.", type: "Purchase", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-09-06", disclosureDate: "Sep 09, 2026", status: "Verified", initials: "SP" },
  { official: "Marcus Bell", party: "Republican", state: "NC", employment: "former", ticker: "META", asset: "Meta Platforms", type: "Sale", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-09-05", disclosureDate: "Sep 08, 2026", status: "Verified", initials: "MB" },
  { official: "Grace Wilson", party: "Democrat", state: "OR", employment: "current", ticker: "AAPL", asset: "Apple Inc.", type: "Purchase", range: "$50,001 – $100,000", amount: 75000, transactionDate: "2026-09-04", disclosureDate: "Sep 07, 2026", status: "Verified", initials: "GW" },
  { official: "Victor Ortiz", party: "Republican", state: "AZ", employment: "current", ticker: "CVX", asset: "Chevron Corporation", type: "Sale", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-09-03", disclosureDate: "Sep 06, 2026", status: "Under review", initials: "VO" },
  { official: "Hannah Lee", party: "Democrat", state: "VA", employment: "current", ticker: "TSLA", asset: "Tesla Inc.", type: "Purchase", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-09-02", disclosureDate: "Sep 05, 2026", status: "Verified", initials: "HL" },
  { official: "Andrew Foster", party: "Republican", state: "PA", employment: "former", ticker: "JPM", asset: "JPMorgan Chase", type: "Sale", range: "$50,001 – $100,000", amount: 75000, transactionDate: "2026-09-01", disclosureDate: "Sep 04, 2026", status: "Verified", initials: "AF" },
  { official: "Nora Green", party: "Democrat", state: "CO", employment: "current", ticker: "CRM", asset: "Salesforce", type: "Purchase", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-08-31", disclosureDate: "Sep 03, 2026", status: "Verified", initials: "NG" },
  { official: "Samuel Price", party: "Republican", state: "MI", employment: "current", ticker: "BA", asset: "Boeing Company", type: "Sale", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-08-30", disclosureDate: "Sep 02, 2026", status: "Under review", initials: "SP" },
  { official: "Leah Turner", party: "Democrat", state: "MN", employment: "former", ticker: "V", asset: "Visa Inc.", type: "Purchase", range: "$50,001 – $100,000", amount: 75000, transactionDate: "2026-08-29", disclosureDate: "Sep 01, 2026", status: "Verified", initials: "LT" },
  { official: "Caleb Morgan", party: "Republican", state: "TN", employment: "current", ticker: "JNJ", asset: "Johnson & Johnson", type: "Purchase", range: "$1,001 – $15,000", amount: 8000, transactionDate: "2026-08-28", disclosureDate: "Aug 31, 2026", status: "Verified", initials: "CM" },
  { official: "Isabel Rivera", party: "Democrat", state: "NJ", employment: "current", ticker: "NFLX", asset: "Netflix Inc.", type: "Sale", range: "$15,001 – $50,000", amount: 32500, transactionDate: "2026-08-27", disclosureDate: "Aug 30, 2026", status: "Verified", initials: "IR" }
];

let trades = [];
let lastFetchTime = Date.now();
const rowContainer = document.querySelector("#trade-rows");
const searchInput = document.querySelector("#search-input");
const typeFilter = document.querySelector("#type-filter");
const partyFilter = document.querySelector("#party-filter");
const employmentFilter = document.querySelector("#employment-filter");
const emptyState = document.querySelector("#empty-state");
const recordCount = document.querySelector("#record-count");
const showingCount = document.querySelector("#showing-count");
let sortDirection = 1;
let sortKey = "transactionDate";
const tradePageSize = 10;
let tradePage = 1;

async function loadTrades() {
  lastFetchTime = Date.now();
  const { fetchTrades } = window.TradeTrackerData;
  const { trades: liveTrades, source, fetchedAt } = await fetchTrades();

  if (liveTrades !== null) {
    trades = liveTrades;
    if (source === "cached") {
      notify("Showing cached trade data — live source temporarily unavailable.");
    }
  } else {
    trades = sampleTrades;
    notify("Live trade data is unavailable; showing the bundled sample.");
  }

  // Update the topbar status indicator
  const liveStatus = document.querySelector(".live-status");
  if (liveStatus && fetchedAt) {
    const label = source === "live" ? "Live" : source === "cached" ? "Cached" : "Sample";
    const fetchTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(fetchedAt));
    // Find most recent valid transaction date
    const today = new Date().toISOString().slice(0, 10);
    const latestDate = trades
      .map(t => t.transactionDate)
      .filter(d => d && d <= today)
      .sort()
      .at(-1);
    const dataAsOf = latestDate
      ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(latestDate + "T12:00:00"))
      : "—";
    liveStatus.innerHTML = `<i></i> Checked ${fetchTime}<span class="live-status-date">Latest trade: ${dataAsOf}</span>`;
  }

  updateDashboard();
  render();
}

// ─── Sector classifier (mirrors data-fetcher.js logic) ──────────────────────
function sectorFor(asset, ticker) {
  const text = `${asset} ${ticker}`.toLowerCase();
  if (/nvidia|amd|intel|qualcomm|broadcom|tsmc|applied material|lam research|kla|micron|marvell|arm|chip|semi/.test(text)) return "Technology";
  if (/lockheed|raytheon|rtx|northrop|general dynamics|boeing|l3harris|bae|defense|aerospace/.test(text)) return "Defense";
  if (/johnson|pfizer|merck|abbvie|united health|cvs|humana|cigna|eli lilly|amgen|biogen|gilead|health|pharma|medical/.test(text)) return "Healthcare";
  if (/exxon|chevron|conocophillips|pioneer|schlumberger|halliburton|energy|oil|gas|petroleum/.test(text)) return "Energy";
  if (/jpmorgan|bank of america|wells fargo|citigroup|goldman|morgan stanley|visa|mastercard|blackrock|finance|financial|bank|insurance/.test(text)) return "Finance";
  if (/amazon|apple|microsoft|alphabet|google|meta|netflix|salesforce|oracle|adobe|software|cloud|tech/.test(text)) return "Technology";
  return "Other";
}

// ─── Dashboard metrics ───────────────────────────────────────────────────────
function updateDashboard() {
  if (!trades.length) return;

  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

  // Hero eyebrow date
  const heroEyebrow = document.querySelector("#hero-eyebrow");
  if (heroEyebrow) heroEyebrow.textContent = `PUBLIC DISCLOSURES · ${fmt.format(now).toUpperCase()}`;

  // ── Week counts ────────────────────────────────────────────────────────────
  const weekStart = new Date(now); weekStart.setUTCDate(now.getUTCDate() - 7);
  const prevWeekStart = new Date(now); prevWeekStart.setUTCDate(now.getUTCDate() - 14);
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const prevWeekStartStr = prevWeekStart.toISOString().slice(0, 10);

  const thisWeek = trades.filter(t => t.transactionDate >= weekStartStr).length;
  const lastWeek = trades.filter(t => t.transactionDate >= prevWeekStartStr && t.transactionDate < weekStartStr).length;
  const weekDiff = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;
  const weekUp = weekDiff >= 0;

  const weekCountEl = document.querySelector("#week-count");
  const weekVsEl = document.querySelector("#week-vs");
  const weekTrendEl = document.querySelector("#week-trend");
  if (weekCountEl) weekCountEl.textContent = thisWeek.toLocaleString();
  if (weekVsEl) weekVsEl.textContent = `vs. ${lastWeek.toLocaleString()} last week`;
  if (weekTrendEl) {
    weekTrendEl.textContent = `${weekUp ? "↑" : "↓"} ${Math.abs(weekDiff)}%`;
    weekTrendEl.className = `trend ${weekUp ? "up" : "down"}`;
  }

  // ── Reported volume ────────────────────────────────────────────────────────
  const totalAmount = trades.reduce((sum, t) => sum + (t.amount || 0), 0);
  const volumeEl = document.querySelector("#volume-value");
  const volumeTrendEl = document.querySelector("#volume-trend");
  if (volumeEl) {
    if (totalAmount >= 1e9) volumeEl.textContent = `$${(totalAmount / 1e9).toFixed(1)}B`;
    else if (totalAmount >= 1e6) volumeEl.textContent = `$${(totalAmount / 1e6).toFixed(1)}M`;
    else volumeEl.textContent = `$${(totalAmount / 1e3).toFixed(0)}K`;
  }
  if (volumeTrendEl) { volumeTrendEl.textContent = "365-day range"; volumeTrendEl.className = "trend"; }

  // ── Top sector ────────────────────────────────────────────────────────────
  const sectorCounts = {};
  trades.forEach(t => {
    const s = sectorFor(t.asset || "", t.ticker || "");
    sectorCounts[s] = (sectorCounts[s] || 0) + 1;
  });
  const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0];
  const topSectorEl = document.querySelector("#top-sector");
  const topSectorPctEl = document.querySelector("#top-sector-pct");
  if (topSector && topSectorEl) {
    const pct = Math.round((topSector[1] / trades.length) * 100);
    topSectorEl.textContent = topSector[0];
    if (topSectorPctEl) topSectorPctEl.textContent = `${pct}% of reported activity`;
  }

  // ── Latest disclosure — exclude future-dated records (bad upstream data) ──
  const todayStr = new Date().toISOString().slice(0, 10);
  const sorted = [...trades]
    .filter(t => t.transactionDate <= todayStr)
    .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
  const latest = sorted[0];
  const latestOfficialEl = document.querySelector("#latest-official");
  const latestFiledEl = document.querySelector("#latest-filed");
  if (latest && latestOfficialEl) {
    const nameParts = latest.official.split(" ");
    const shortName = nameParts.length >= 2 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : latest.official;
    latestOfficialEl.textContent = shortName;
    const txDate = new Date(latest.transactionDate + "T12:00:00");
    const daysAgo = Math.floor((now - txDate) / 86400000);
    const timeLabel = daysAgo === 0 ? "today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
    // Count transactions by this official on the same date
    const officialTxCount = trades.filter(t => t.official === latest.official && t.transactionDate === latest.transactionDate).length;
    if (latestFiledEl) latestFiledEl.textContent = `Filed ${timeLabel} · ${officialTxCount} transaction${officialTxCount !== 1 ? "s" : ""}`;
  }

  // ── Analytics: monthly bar chart ──────────────────────────────────────────
  const monthCounts = {};
  trades.forEach(t => {
    const month = t.transactionDate.slice(0, 7); // YYYY-MM
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  const months = Object.keys(monthCounts).sort().slice(-6);
  const maxCount = Math.max(...months.map(m => monthCounts[m]), 1);
  const total365 = trades.length;
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const barChart = document.querySelector("#bar-chart");
  const chartLabels = document.querySelector("#chart-labels");
  const analyticsTotalEl = document.querySelector("#analytics-total");
  const analyticsTotalFilingsEl = document.querySelector("#analytics-total-filings");
  if (analyticsTotalEl) analyticsTotalEl.textContent = total365.toLocaleString();
  if (analyticsTotalFilingsEl) analyticsTotalFilingsEl.textContent = total365.toLocaleString();

  if (barChart && months.length) {
    barChart.innerHTML = months.map((m, i) => {
      const count = monthCounts[m];
      const h = Math.round((count / maxCount) * 100);
      const label = monthNames[parseInt(m.slice(5), 10) - 1];
      const isCurrent = i === months.length - 1;
      return `<span tabindex="0" style="height:${h}%" ${isCurrent ? 'class="current-bar"' : ""} data-portrait="${count}" data-tooltip="${label} · ${count.toLocaleString()} filings|+ ${count} transactions recorded|- Volume does not imply intent"></span>`;
    }).join("");
  }
  if (chartLabels && months.length) {
    chartLabels.innerHTML = months.map(m => `<span>${monthNames[parseInt(m.slice(5), 10) - 1]}</span>`).join("");
  }

  // ── Analytics: buy/sell split ─────────────────────────────────────────────
  const purchases = trades.filter(t => t.type === "Purchase").length;
  const sales = trades.filter(t => t.type === "Sale").length;
  const buyPct = Math.round((purchases / trades.length) * 100);
  const sellPct = 100 - buyPct;

  const miniPiePct = document.querySelector("#mini-pie-pct");
  const miniBuyPct = document.querySelector("#mini-buy-pct");
  const miniSellPct = document.querySelector("#mini-sell-pct");
  const miniPieLabel = document.querySelector("#mini-pie-label");
  const buySellTitle = document.querySelector("#buy-sell-title");
  const donutEl = document.querySelector("#donut");
  const donutCount = document.querySelector("#donut-count");
  const legendBuyPct = document.querySelector("#legend-buy-pct");
  const legendSellPct = document.querySelector("#legend-sell-pct");
  const legendBuy = document.querySelector("#legend-buy");
  const legendSell = document.querySelector("#legend-sell");

  if (miniPiePct) miniPiePct.textContent = `${buyPct}%`;
  if (miniBuyPct) miniBuyPct.textContent = `${buyPct}%`;
  if (miniSellPct) miniSellPct.textContent = `${sellPct}%`;
  if (miniPieLabel) miniPieLabel.setAttribute("aria-label", `${buyPct} percent purchases, ${sellPct} percent sales`);
  if (buySellTitle) buySellTitle.innerHTML = `${buyPct}% <small>purchases</small>`;
  if (donutEl) { donutEl.dataset.portrait = `${buyPct}% / ${sellPct}%`; donutEl.dataset.tooltip = `Buy / sell mix|+ Purchases at ${buyPct}%|- Intent does not predict price`; }
  if (donutCount) donutCount.innerHTML = `${total365.toLocaleString()}<small>trades</small>`;
  if (legendBuyPct) legendBuyPct.textContent = `${buyPct}%`;
  if (legendSellPct) legendSellPct.textContent = `${sellPct}%`;
  if (legendBuy) { legendBuy.dataset.portrait = `${buyPct}%`; legendBuy.dataset.tooltip = `Purchases · ${buyPct}%|+ Buying leads|- Ranges are estimates`; }
  if (legendSell) { legendSell.dataset.portrait = `${sellPct}%`; legendSell.dataset.tooltip = `Sales · ${sellPct}%|+ Useful context|- May be rebalancing`; }

  // ── Analytics: sector breakdown chart ────────────────────────────────────
  const sectorChart = document.querySelector("#sector-chart");
  if (sectorChart) {
    const sectorEntries = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const maxSector = sectorEntries[0]?.[1] || 1;
    const rows = sectorEntries.map(([name, count]) => {
      const pct = Math.round((count / trades.length) * 100);
      const barWidth = Math.round((count / maxSector) * 100);
      return `<div class="sector-row" tabindex="0" data-portrait="${pct}%" data-tooltip="${name} · ${pct}%|+ ${count} transactions|- Volume is not quality"><span>${name}</span><div><i style="width:${barWidth}%"></i></div><b>${pct}%</b></div>`;
    }).join("");
    sectorChart.innerHTML = `<div class="chart-title"><span>Top sectors by volume</span><small>reported ranges</small></div>${rows}`;
  }

  // Re-wire tooltips for any dynamically created elements
  wireTooltips();
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = trades
    .filter((trade) => (typeFilter.value === "all" || trade.type === typeFilter.value))
    .filter((trade) => (partyFilter.value === "all" || trade.party === partyFilter.value))
    .filter((trade) => (employmentFilter.value === "all" || trade.employment === employmentFilter.value))
    .filter((trade) => [trade.official, trade.ticker, trade.asset, trade.party, trade.employment].some((value) => value.toLowerCase().includes(query)))
    .sort((a, b) => {
      const first = sortKey === "amount" ? a.amount : a[sortKey];
      const second = sortKey === "amount" ? b.amount : b[sortKey];
      return (first > second ? 1 : first < second ? -1 : 0) * sortDirection;
    });
  const totalPages = Math.max(1, Math.ceil(filtered.length / tradePageSize));
  tradePage = Math.min(tradePage, totalPages);
  const start = (tradePage - 1) * tradePageSize;
  const visibleTrades = filtered.slice(start, start + tradePageSize);

  rowContainer.innerHTML = visibleTrades.map((trade) => `
    <tr>
      <td><div class="official-cell"><span class="official-initial">${trade.initials}</span><span class="official-name">${trade.official}<small>${trade.party} · ${trade.state} · ${trade.employment === "current" ? "Current" : "Former"}</small></span></div></td>
      <td><span class="asset-ticker">${trade.ticker}</span><span class="asset-name">${trade.asset}</span></td>
      <td><span class="action ${trade.type.toLowerCase()}">${trade.type}</span></td>
      <td><span class="amount">${trade.range}</span></td>
      <td><span class="date">${trade.transactionDate}</span><small class="disclosure-date">Filed ${trade.disclosureDate}</small></td>
      <td><span class="status ${trade.status === "Verified" ? "verified" : "review"}">${trade.status}</span></td>
      <td><a class="source-link" href="https://disclosures-clerk.house.gov/" target="_blank" rel="noreferrer" aria-label="View source for ${trade.official}">↗</a></td>
    </tr>
  `).join("");

  emptyState.classList.toggle("hidden", filtered.length > 0);
  recordCount.textContent = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;
  const rangeStart = filtered.length > 0 ? start + 1 : 0;
  const rangeEnd = start + visibleTrades.length;
  showingCount.textContent = `${rangeStart}–${rangeEnd} / ${filtered.length}`;
  document.querySelector("#trade-page").textContent = `${tradePage}/${totalPages}`;
  document.querySelector("#trade-prev").disabled = tradePage === 1;
  document.querySelector("#trade-next").disabled = tradePage === totalPages;
}

document.querySelectorAll(".sort-button").forEach((button) => {
  button.addEventListener("click", () => {
    const nextKey = button.dataset.sort;
    sortDirection = sortKey === nextKey ? sortDirection * -1 : 1;
    sortKey = nextKey;
    loadTrades();
  });
});
[searchInput, typeFilter, partyFilter, employmentFilter].forEach((control) => control.addEventListener("input", () => {
  tradePage = 1;
  render();
}));
document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "all";
  partyFilter.value = "all";
  employmentFilter.value = "all";
  tradePage = 1;
  render();
});

const toast = document.querySelector("#toast");
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}
document.querySelector("#export-button").addEventListener("click", () => notify("Export prepared — connect a data provider to download live records."));
document.querySelector("#signals-toggle").addEventListener("click", () => {
  const signals = document.querySelector("#signals");
  const visible = signals.classList.toggle("hidden") === false;
  document.querySelector("#signals-toggle").textContent = visible ? "Hide signals" : "View signals";
  if (visible) signals.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#trade-prev").addEventListener("click", () => {
  tradePage -= 1;
  render();
});
document.querySelector("#trade-next").addEventListener("click", () => {
  tradePage += 1;
  render();
});
document.querySelector("#watchlist-see-all").addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "all";
  partyFilter.value = "all";
  employmentFilter.value = "all";
  tradePage = 1;
  render();
  document.querySelector("#officials").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#theme-toggle").addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-mode");
  document.querySelector("#theme-toggle").textContent = dark ? "☀" : "☾";
  document.querySelector("#theme-toggle").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  localStorage.setItem("public-ledger-theme", dark ? "dark" : "light");
});
if (localStorage.getItem("public-ledger-theme") === "dark") {
  document.body.classList.add("dark-mode");
  document.querySelector("#theme-toggle").textContent = "☀";
}
document.querySelector("#analytics-range").addEventListener("change", (event) => notify(`Analytics range set to ${event.target.value.toLowerCase()}.`));

function wireTooltips(root) {
  (root || document).querySelectorAll("[data-tooltip]").forEach((element) => {
    if (element.dataset.tooltipWired) return; // avoid double-wiring
    element.dataset.tooltipWired = "1";
    const tooltipText = element.dataset.tooltip.replaceAll("|", "\\A");
    element.style.setProperty("--tooltip-text", `"${tooltipText}"`);
    element.style.setProperty("--tooltip-portrait", `"${element.dataset.portrait || ""}"`);
    element.addEventListener("click", () => {
      const analytics = document.querySelector("#analytics");
      const detailMode = analytics.classList.toggle("analytics-detail-mode");
      document.querySelector("#analytics-mode").textContent = detailMode ? "Landscape · more detail" : "Portrait · numbers only";
      showAnalyticsTooltip(element);
    });
    element.addEventListener("mouseenter", () => showAnalyticsTooltip(element));
    element.addEventListener("focus", () => showAnalyticsTooltip(element));
    element.addEventListener("mouseleave", hideAnalyticsTooltip);
    element.addEventListener("blur", hideAnalyticsTooltip);
  });
}
wireTooltips();

const analyticsTooltip = document.querySelector("#analytics-tooltip");
document.body.classList.add("analytics-custom-tooltip");
function showAnalyticsTooltip(element) {
  const detail = document.querySelector("#analytics").classList.contains("analytics-detail-mode");
  const [title, positive, caution] = element.dataset.tooltip.split("|");
  analyticsTooltip.className = `analytics-tooltip show${detail ? " detail" : ""}`;
  analyticsTooltip.innerHTML = detail
    ? `<strong>${title}</strong><div class="tooltip-detail"><b>${positive}</b><br>${caution}</div>`
    : `<strong>${element.dataset.portrait || "—"}</strong><div class="tooltip-mini-graph"><i style="height:35%"></i><i style="height:55%"></i><i style="height:42%"></i><i style="height:72%"></i><i style="height:58%"></i><i style="height:84%"></i></div><div class="tooltip-mini-pie"><span>61%</span></div><small>61% buy · 39% sell</small>`;
  const bounds = element.getBoundingClientRect();
  const width = detail ? 150 : 120;
  const left = Math.min(Math.max(8, bounds.left + bounds.width / 2 - width / 2), window.innerWidth - width - 8);
  analyticsTooltip.style.left = `${left}px`;
  analyticsTooltip.style.top = `${Math.max(8, bounds.top - analyticsTooltip.offsetHeight - 12)}px`;
}
function hideAnalyticsTooltip() {
  analyticsTooltip.classList.remove("show");
}

render();
loadTrades();

// ── Background auto-refresh ───────────────────────────────────────────────
// Re-fetches live data every 2 hours while the page is open.
const REFRESH_MS = 2 * 60 * 60 * 1000;

setInterval(() => {
  if (!document.hidden) loadTrades();
}, REFRESH_MS);

// Also refresh when the user returns to the tab if 2+ hours have passed.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && Date.now() - lastFetchTime >= REFRESH_MS) loadTrades();
});
