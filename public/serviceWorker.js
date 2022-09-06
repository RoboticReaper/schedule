self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request).then((fetchRes) => {
        let type = event.request.method !== "POST";
        let fetchClone = fetchRes.clone();

        if(type){
          // don't cache POST requests
          caches.open("v1").then((cache) => {
            cache.put(event.request, fetchClone);
          })
        } 

        return fetchRes;
      });
    })
  );
});


self.addEventListener("install", (e) => {
  self.skipWaiting();
})

self.addEventListener("activate", () => {
  self.clients.claim();
})