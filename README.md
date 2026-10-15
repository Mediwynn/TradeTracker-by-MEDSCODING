# TradeTracker by MEDSCODING

TradeTracker is a browser-based app for exploring publicly disclosed government official stock trades and related market context. Data is fetched live on every page load — no server required.

## Features

- Live trade data fetched from the House Stock Watcher public disclosure dataset
- News and deal-watch context from Google News RSS, SEC press releases, and White House announcements
- Disclosure-based risk indicators and a clearly labeled, unverified deal-report watch
- Search, filter, and sort trade disclosures
- Current and former official filtering
- Amount and transaction-time sorting
- Historical analytics with trend and sector views
- Evidence-based signals with explanatory context
- Light and dark themes
- Works on any device — desktop, phone, tablet

## Running locally

```
npm start
```

This opens `index.html` in your default browser. No build step or install required.

## Sharing

Send `TradeTracker.url` to any Windows user. They can double-click it to open the hosted app at:

https://mediwynn.github.io/TradeTracker-by-MEDSCODING/

## Data sources

- **Trades** — [House Stock Watcher](https://github.com/TattooedHead/house-stock-watcher-data) dataset, covering the last 365 days. Verify filings at the [U.S. House Clerk disclosure portal](https://disclosures-clerk.house.gov/FinancialDisclosure). The [U.S. Senate eFD portal](https://efdsearch.senate.gov/search/) is linked as an additional primary reference, but Senate filings are not currently imported into the dashboard.
- **News** — Google News RSS for public-disclosure context and potential/pending deal reports, plus official [SEC press releases](https://www.sec.gov/news/pressreleases.rss) and [White House announcements](https://www.whitehouse.gov/news/feed/). Article links lead to their publishers when available.
- **Fallback** — Static JSON files in `data/` are refreshed daily by a GitHub Actions workflow and served as a backup if live sources are temporarily unavailable

Risk indicators describe concentration and reporting/data-quality characteristics of the loaded disclosures; they are not market-risk scores. Deal-watch headlines are leads only, labeled unverified, and must be checked against the original source.

## Disclaimer

This project is for educational and informational purposes. It is not financial advice, and its signals are not recommendations to buy or sell securities.
