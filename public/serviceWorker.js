// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then((cacheRes) => {
//       return fetch(event.request).then((fetchRes) => {
//         // don't save POST requests, don't save urls containing google unless it's from google calendar
//         let type = event.request.method !== "POST" && (!event.request.url.match(/google/i) || event.request.url.match(/clients6.google.com/i));
//         let fetchClone = fetchRes.clone();

//         if (type) {
//           caches.open("cache").then((cache) => {
//             cache.put(event.request, fetchClone);
//           })
//         }


//         return fetchRes;
//       }).catch(err => {
//         return cacheRes;
//       })
//     })
//   );
// });

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      if (cacheRes === undefined) {
        // not found in cache. receive from network and cache the response
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
          console.log(err)
        })
      } else {
        // found in cache. serve the cache then update cache from network
        updateCache(event)

        return cacheRes;
      }
    })
  );
});

async function updateCache(evt){
  fetch(evt.request).then((fetchRes) => {
    // don't save POST requests, don't save urls containing google unless it's from google calendar
    let type = evt.request.method !== "POST" && (!evt.request.url.match(/google/i) || evt.request.url.match(/clients6.google.com/i));
    let fetchClone = fetchRes.clone();

    if (type) {
      caches.open("cache").then((cache) => {
        cache.put(evt.request, fetchClone);
      })
    }

  }).catch(err => {
    console.log(err)
  })
}

self.addEventListener("install", (e) => {
  self.skipWaiting();
})

self.addEventListener("activate", () => {
  self.clients.claim();
})