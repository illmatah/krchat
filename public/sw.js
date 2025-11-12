const cacheName = "v1";
async function impl(e) {
  let cache = await caches.open(cacheName); // Cache megnyitása, async
  let cacheResponse = await cache.match(e.request); // Lookup
  if (cacheResponse) // Ha megvan
    return cacheResponse // Visszadjuk
  else {
    let networkResponse = await fetch(e.request); // Ha nincs meg, akkor elindítjuk a tényleges hálózati lekérdezést
    cache.put(e.request, networkResponse.clone()) // Eltároljuk
    return networkResponse; // Visszadjuk
  }
}
self.addEventListener("fetch", 
  /** @param {FetchEvent} e */ (e) => e.respondWith(impl(e))
); // Eseményre feliratkozás
self.addEventListener('push',
  /** @param {PushEvent} e */ async (e) => {
    const message = e.data.text()
    if (!message) {
      console.error('Push event but no data')
      return
    }
    await self.registration.showNotification('Chat notification', {
      body: message
    })
  }
)