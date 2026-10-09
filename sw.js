// Caché offline para usar la guía sin señal (p. ej. en San Blas)
const V='pty-v1';
const CORE=['./','index.html','manifest.webmanifest','icon.svg','img/aguaclara.jpg','img/amador.jpg','img/amador2.jpg','img/ancon.jpg','img/bartender.jpg','img/biomuseo.jpg','img/biomuseo2.jpg','img/casco.jpg','img/casco2.jpg','img/casconight.jpg','img/cinta.jpg','img/cinta2.jpg','img/club.jpg','img/copa.jpg','img/embera.jpg','img/gatun.jpg','img/mercado.jpg','img/mercado2.jpg','img/metro.jpg','img/metro2.jpg','img/miraflores.jpg','img/miraflores2.jpg','img/monkey.jpg','img/panviejo.jpg','img/plazafrancia.jpg','img/portobelo.jpg','img/riu.jpg','img/sanblas.jpg','img/sanblas2.jpg','img/sanblas3.jpg','img/sanblas4.jpg','img/sanjose.jpg','img/skyline.jpg','img/skynight.jpg','img/sloth.jpg','img/taboga.jpg','img/taboga2.jpg','img/tocumen.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='pty-rt').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')){
      e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return;
    }
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})));return;
  }
  // CDN, fuentes y mosaicos del mapa: stale-while-revalidate
  e.respondWith(caches.open('pty-rt').then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>m);return m||f})));
});
