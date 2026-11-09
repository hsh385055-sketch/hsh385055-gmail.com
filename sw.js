// Quiet Player iPad static app shell. Music remains in IndexedDB.
const CACHE='quiet-player-ipad-shell-v4';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('quiet-player-ipad-shell-')&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put('./index.html',response.clone())).catch(()=>{});return response;}).catch(()=>caches.match('./index.html')));
 } else {
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
 }
});
