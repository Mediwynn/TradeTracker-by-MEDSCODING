# TradeTracker by MEDSCODING

TradeTracker is a browser-based app for exploring publicly disclosed government official stock trades and related market context. Signed-out views show a minimum 150-day delay; signed-in Supabase users see current available data.

## Features

- Live trade data fetched from the House Stock Watcher public disclosure dataset
- News and deal-watch context from Google News RSS, SEC press releases, and White House announcements
- Disclosure-based risk indicators and a clearly labeled, unverified deal-report watch
- Search, filter, and sort trade disclosures
- Current and former official filtering
- Amount and transaction-time sorting
- Historical analytics with trend and sector views
- Evidence-based signals with explanatory context
- Optional Supabase accounts with email verification and password recovery
- Light and dark themes
- Works on any device — desktop, phone, tablet

## Running locally

```
npm start
```

This opens `index.html` in your default browser. No build step or install required.

## Optional accounts (Supabase Auth)

The dashboard remains public. Signed-out visitors can browse disclosures and news with a minimum 150-day publication delay. To enable account creation and sign-in for current available data:

1. Create a Supabase project and enable Email as an authentication provider.
2. In Supabase Auth URL configuration, set the site URL to `https://mediwynn.github.io/TradeTracker-by-MEDSCODING/` and allow that URL plus your local development URL (for example, `http://localhost:8765/**`) as redirect URLs.
3. Keep email confirmations enabled to require verification for new sign-ups.
4. Set `url` and the project's **publishable/anon key** in `auth-config.js`. These are public client credentials; never put a Supabase service-role key in this browser app.
5. Serve the app over HTTP(S), then use **Account** to create an account, verify the email link, sign in, or request a password reset. For example, run `python -m http.server 8765` in the project folder and open `http://localhost:8765/`.

Until configured, the Account button explains that sign-in is unavailable and the public dashboard continues to work with the 150-day delay. Authenticated users are stored by Supabase Auth in their browser session; this app does not currently store personal account data. Do not add private user data without first defining and enforcing database row-level security policies.

On `localhost` only, when Supabase is not configured, the account dialog offers a UI-testing demo login:

- Email: `demo@tradetracker.local`
- Password: `TradeTrackerDemo2026!`

This hard-coded demo does not create or verify an account, does not contact an auth service, and does not unlock current data. It is disabled on non-local hosts and is not available if Supabase credentials are configured.

For local manual testing only, you can also sign in with username `admin1234` and password `admin1234`. This temporary mock is restricted to localhost and the current browser tab; it is not a real account, does not grant administrator privileges, and must not be used on a deployed site.

### Administrator account

Administrator accounts must be real Supabase users and sign in with an email address; `Admin1234` alone is not a supported login identifier. Create the user in the Supabase dashboard (Authentication → Users) with a unique, strong password. Do not use the requested short password `1234`.

To mark the user as an administrator, set the user's trusted `app_metadata` role to `admin` using a secure Supabase admin environment or trusted server-side process. Never put a Supabase service-role key, admin password, or admin-role setter in this public repository or browser code. The account dialog identifies users with that trusted metadata, but this static app currently has no admin-only operations. Any future administrative actions or private data must be authorized on a trusted server or enforced by database row-level security; hiding UI controls is not access control.

The account dialog also offers **Continue as guest**. Guest mode does not require an account and uses only the bundled static snapshots: at most 10 trade disclosures and 12 news stories, each at least 150 days old, with no live-source requests or background refresh. The banner shows when the snapshot was generated and warns that it may be outdated. Guest mode lasts for the current browser tab session; use **Exit guest mode** to return to the regular delayed public view.

The 150-day delay is a display filter, not a security boundary: the underlying sources and static data files are public and can be accessed directly.

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
