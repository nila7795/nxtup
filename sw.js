const CACHE='nxtup-v5';
const CORE=['./','index.html','style.css','app.js','manifest.webmanifest','impressum.html'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))]))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;if(e.request.mode==='navigate'||/\.(html|css|js)$/.test(u.pathname)){e.respondWith(fetch(e.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
