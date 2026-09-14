const trades = [
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
let visibleCount = 5;

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
  const visibleTrades = filtered.slice(0, visibleCount);

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
  showingCount.textContent = visibleTrades.length;
  document.querySelector("#total-count").textContent = filtered.length;
  const loadMore = document.querySelector("#load-more");
  loadMore.disabled = visibleTrades.length >= filtered.length;
  loadMore.innerHTML = loadMore.disabled ? "All loaded <span>✓</span>" : "Load more <span>→</span>";
}

document.querySelectorAll(".sort-button").forEach((button) => {
  button.addEventListener("click", () => {
    const nextKey = button.dataset.sort;
    sortDirection = sortKey === nextKey ? sortDirection * -1 : 1;
    sortKey = nextKey;
    render();
  });
});
[searchInput, typeFilter, partyFilter, employmentFilter].forEach((control) => control.addEventListener("input", render));
document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "all";
  partyFilter.value = "all";
  employmentFilter.value = "all";
  visibleCount = 5;
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
document.querySelector("#load-more").addEventListener("click", () => {
  visibleCount += 5;
  render();
});
document.querySelector("#watchlist-see-all").addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "all";
  partyFilter.value = "all";
  employmentFilter.value = "all";
  visibleCount = 5;
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
document.querySelectorAll("[data-tooltip]").forEach((element) => {
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
