const CACHE = "flashcards-v1";

// Pre-cache the main shell
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/"])));
  self.skipWaiting();
});

// Delete old caches on activation
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// Cache-first for static assets, network-first for API/navigation
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Always hit network for API calls
  if (url.pathname.startsWith("/api/")) return;

  e.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request).then((res) => {
        if (res.ok) {
          caches.open(CACHE).then((c) => c.put(request, res.clone()));
        }
        return res;
      });
      return cached || fresh;
    })
  );
});
