const news = [
  { id: "defense", source: "REUTERS", date: "2026-09-14", category: "Policy & markets", relevance: 100, title: "Defense names rally as committee advances new spending bill", summary: "Policy changes could increase procurement activity across defense companies." },
  { id: "ethics", source: "AP NEWS", date: "2026-09-13", category: "Government", relevance: 96, title: "Senate ethics office updates financial disclosure guidance", summary: "New guidance explains how covered officials should report securities transactions." },
  { id: "chips", source: "BLOOMBERG", date: "2026-09-13", category: "Markets", relevance: 94, title: "Chip stocks lead a week of renewed congressional trading", summary: "Technology shares were among the most frequently mentioned names in recent disclosures." },
  { id: "energy", source: "REUTERS", date: "2026-08-24", category: "Markets", relevance: 82, title: "Energy shares react to shifting supply outlook", summary: "Oil and gas markets respond to updated supply and demand expectations." },
  { id: "filings", source: "AP NEWS", date: "2026-07-18", category: "Government", relevance: 78, title: "Financial disclosure filings bring renewed focus to reporting timelines", summary: "Experts review why transaction and filing dates can differ." },
  { id: "defense-review", source: "BLOOMBERG", date: "2026-05-02", category: "Policy & markets", relevance: 75, title: "Defense budget review puts contractors in focus", summary: "Investors weigh budget negotiations and potential procurement priorities." },
  { id: "tech-volatility", source: "REUTERS", date: "2026-02-11", category: "Markets", relevance: 70, title: "Technology shares face a volatile start to the year", summary: "Large-cap technology companies trade through changing rate expectations." },
  { id: "ethics-report", source: "AP NEWS", date: "2025-10-08", category: "Government", relevance: 66, title: "Annual ethics report highlights disclosure compliance", summary: "The report summarizes common filing issues and review procedures." }
];

const resultContainer = document.querySelector("#news-results");
const search = document.querySelector("#news-search");
const sort = document.querySelector("#news-sort");
const category = document.querySelector("#news-category-filter");
const empty = document.querySelector("#news-empty");
const count = document.querySelector("#news-count");
const range = document.querySelector("#news-range");
const newsPageSize = 5;
let newsPage = 1;

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function renderNews() {
  const query = search.value.trim().toLowerCase();
  const filtered = news.filter((item) => {
    const matchesCategory = category.value === "all" || item.category === category.value;
    const matchesQuery = [item.title, item.summary, item.source, item.category].some((value) => value.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    if (sort.value === "oldest") return a.date.localeCompare(b.date);
    if (sort.value === "source") return a.source.localeCompare(b.source) || b.date.localeCompare(a.date);
    if (sort.value === "newest") return b.date.localeCompare(a.date);
    return b.relevance - a.relevance || b.date.localeCompare(a.date);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / newsPageSize));
  newsPage = Math.min(newsPage, totalPages);
  const pageItems = filtered.slice((newsPage - 1) * newsPageSize, newsPage * newsPageSize);
  resultContainer.innerHTML = pageItems.map((item) => `
    <a class="news-result" href="news.html?id=${item.id}">
      <span class="news-source">${item.source} · ${formatDate(item.date)}</span>
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <small>${item.category}</small>
    </a>
  `).join("");
  empty.classList.toggle("hidden", filtered.length > 0);
  count.textContent = `${filtered.length} stor${filtered.length === 1 ? "y" : "ies"}`;
  document.querySelector("#news-page").textContent = `${newsPage}/${totalPages}`;
  document.querySelector("#news-prev").disabled = newsPage === 1;
  document.querySelector("#news-next").disabled = newsPage === totalPages;
  if (filtered.length > 0) {
    const dates = filtered.map((item) => item.date).sort();
    range.textContent = `Available news: ${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`;
  } else {
    range.textContent = "Available news: no matching dates";
  }
}

[search, sort, category].forEach((control) => control.addEventListener("input", () => {
  newsPage = 1;
  renderNews();
}));
document.querySelector("#news-prev").addEventListener("click", () => {
  newsPage -= 1;
  renderNews();
});
document.querySelector("#news-next").addEventListener("click", () => {
  newsPage += 1;
  renderNews();
});
renderNews();
