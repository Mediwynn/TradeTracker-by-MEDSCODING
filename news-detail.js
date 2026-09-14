const articles = {

  defense: {

    source: "REUTERS",

    time: "2 hours ago",

    category: "Policy & markets",

    title: "Defense names rally as committee advances new spending bill",

    summary: "Defense-sector shares moved higher after a congressional committee advanced a spending proposal that could increase procurement activity.",

    details: "The proposal would direct additional funding toward aircraft, missile defense, and other strategic programs. Investors are watching the committee process closely, while public disclosures provide context about official activity but do not establish a causal relationship with market moves.",

    original: "https://www.reuters.com/"

  },

  ethics: {

    source: "AP NEWS",

    time: "5 hours ago",

    category: "Government",

    title: "Senate ethics office updates financial disclosure guidance",

    summary: "Updated guidance explains how covered officials should report securities transactions and related financial interests.",

    details: "The guidance is intended to make disclosure requirements easier to follow and review. Filing dates and transaction dates can differ, so TradeTracker presents both when available.",

    original: "https://apnews.com/"

  },

  chips: {

    source: "BLOOMBERG",

    time: "1 day ago",

    category: "Markets",

    title: "Chip stocks lead a week of renewed congressional trading",

    summary: "Technology shares were among the most frequently mentioned names in recent public transaction disclosures.",

    details: "The article reviews broader market activity around semiconductor companies. A reported official transaction is one data point and should not be treated as a prediction or investment recommendation.",

    original: "https://www.bloomberg.com/"

  }

};



function cleanSummary(value) {
  const decoded = document.createElement("textarea");
  decoded.innerHTML = value || "";
  return decoded.value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function renderArticle(article) {
  document.querySelector("#news-source").textContent = article.source + " · " + article.time.toUpperCase();
  document.querySelector("#news-category").textContent = article.category;
  document.querySelector("#news-title").textContent = article.title;
  document.querySelector("#news-summary").textContent = article.summary;
  document.querySelector("#news-details").textContent = article.details;
  const originalLink = document.querySelector("#original-link");
  if (article.original) originalLink.href = article.original;
  else originalLink.remove();
}

async function loadArticle() {
  const articleId = new URLSearchParams(window.location.search).get("id");
  const fallback = articles[articleId] || articles.defense;
  try {
    const response = await fetch("data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("News feed returned " + response.status);
    const liveArticle = (await response.json()).find((item) => item.id === articleId);
    if (!liveArticle) return renderArticle(fallback);
    renderArticle({
      source: liveArticle.source || "PUBLIC NEWS",
      time: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(liveArticle.date + "T12:00:00")),
      category: liveArticle.category || "Government",
      title: liveArticle.title,
      summary: cleanSummary(liveArticle.summary),
      details: "This article is included as public context for TradeTracker disclosures. The source story and the underlying filing should be reviewed independently; correlation does not establish causation.",
      original: liveArticle.originalUrl
    });
  } catch (error) {
    console.error("Unable to load the live news article.", error);
    renderArticle(fallback);
  }
}

loadArticle();
