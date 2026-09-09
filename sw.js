const CACHE='nxtup-v12';
const CORE=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./vendor/leaflet.js','./vendor/leaflet.css'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Nur eigene Dateien zwischenspeichern. Kartenkacheln und externe Dienste nie.
  if(e.request.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(
    fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
