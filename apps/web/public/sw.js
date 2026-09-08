// Removes an old service worker left by an earlier local build.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([self.registration.unregister(), self.clients.claim()]),
  );
});
