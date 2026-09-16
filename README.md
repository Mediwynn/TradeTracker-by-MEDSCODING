# TradeTracker by MEDSCODING

TradeTracker is a browser-based app for exploring publicly disclosed government official stock trades and related market context. Data is fetched live on every page load — no server required.

## Features

- Live trade data fetched directly from public disclosure sources on every load
- Live news feed via Google News RSS (congressional and market context)
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

- **Trades** — [House Stock Watcher](https://github.com/TattooedHead/house-stock-watcher-data) public disclosure dataset, covering the last 365 days
- **News** — Google News RSS, filtered for congressional and government financial disclosure topics
- **Fallback** — Static JSON files in `data/` are refreshed daily by a GitHub Actions workflow and served as a backup if live sources are temporarily unavailable

## Disclaimer

This project is for educational and informational purposes. It is not financial advice, and its signals are not recommendations to buy or sell securities.
