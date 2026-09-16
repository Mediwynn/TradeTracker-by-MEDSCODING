const CACHE_NAME = "tradetracker-v7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data-fetcher.js",
  "./news.html",
  "./news-detail.js",
  "./news-list.html",
  "./news-list.js?v=5",
  "./manifest.webmanifest",
  "./app-icon.svg"
];

// These origins must always go directly to the network — never served from cache.
// Includes the live trade source, the CORS proxy, and Google News RSS.
const BYPASS_ORIGINS = [
  "raw.githubusercontent.com",
  "api.allorigins.win",
  "api.rss2json.com",
  "news.google.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Always let external live-data requests go straight to the network.
  // The data-fetcher handles its own retry/fallback logic.
  if (BYPASS_ORIGINS.some((origin) => requestUrl.hostname === origin)) {
    return; // no respondWith — browser fetches normally
  }

  const isDataFeed = requestUrl.pathname.endsWith(".json") && requestUrl.pathname.includes("/data/");

  if (isDataFeed) {
    // Static fallback JSON: network-first, cache on success, serve cache offline
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (event.request.method === "GET" && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
