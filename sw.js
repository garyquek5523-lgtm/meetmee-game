// Meet Mee 消消乐 Service Worker
// 换图/改代码后发布新版：改这个版本号即可让所有玩家自动更新
const CACHE = 'meetmee-v5';
const ASSETS = [
  './index.html',
  './manifest.json',
  './img/egg.png', './img/noodle.png', './img/chili.png', './img/ikanbilis.png',
  './img/sayur.png', './img/shallot.png', './img/sauce.png', './img/chilioil.png',
  './img/mm.png', './img/mm2.png', './img/packet1.jpg', './img/packet2.jpg',
  './img/icon-192.png', './img/icon-512.png',
  './audio/sedap.mp3', './audio/mantap.mp3', './audio/terbaik.mp3', './audio/pedasgila.mp3',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// 先走网络（保证拿到最新版），断网时用缓存 → 离线也能玩
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return resp;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
