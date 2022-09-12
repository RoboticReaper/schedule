self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return fetch(event.request).then((fetchRes) => {
        // don't save POST requests, don't save urls containing google unless it's from google calendar
        let type = event.request.method !== "POST" && (!event.request.url.match(/google/i) || event.request.url.match(/clients6.google.com/i));
        let fetchClone = fetchRes.clone();

        if (type) {
          caches.open("cache").then((cache) => {
            cache.put(event.request, fetchClone);
          })
        }


        return fetchRes;
      }).catch(err => {
        return cacheRes;
      })
    })
  );
});


self.addEventListener("install", (e) => {
  self.skipWaiting();
})

self.addEventListener("activate", () => {
  self.clients.claim();
})