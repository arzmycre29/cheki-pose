const CACHE_NAME = "chekipose-offline-v3-20261126c";
const FONT_CACHE_NAME = "chekipose-fonts-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css?v=20261126c",
  "./js/app.js?v=20261126c",
  "./js/poses-data.js?v=20261126c",
  "./js/audio.js?v=20261126c",
  "./js/diagrams.js?v=20261126c",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

const POSE_IMAGES = [
  "./assets/poses/cute/pose_12_427630927133681822.jpg",
  "./assets/poses/cute/pose_13_1020769071790339046.jpg",
  "./assets/poses/cute/pose_14_833025262370796074.jpg",
  "./assets/poses/cute/pose_15_710724384979487138.jpg",
  "./assets/poses/cute/pose_16_1019080221911222157.jpg",
  "./assets/poses/cute/pose_17_1040401951449816825.jpg",
  "./assets/poses/cute/pose_19_989103136932738787.jpg",
  "./assets/poses/cute/pose_20_443956475749893231.jpg",
  "./assets/poses/cute/pose_21_783204191487536601.jpg",
  "./assets/poses/cute/pose_27_1014928466016398681.jpg",
  "./assets/poses/cute/pose_28_465489311473082245.jpg",
  "./assets/poses/cute/pose_30_974255331907882117.jpg",
  "./assets/poses/cute/pose_35_957226095781008375.jpg",
  "./assets/poses/cute/pose_41_797348309055471782.jpg",
  "./assets/poses/fun/pose_04_817051557432495134.jpg",
  "./assets/poses/fun/pose_05_581879214354665973.jpg",
  "./assets/poses/fun/pose_07_1034842820655989192.jpg",
  "./assets/poses/fun/pose_18_722053752809024929.jpg",
  "./assets/poses/fun/pose_22_635781672440844159.jpg",
  "./assets/poses/fun/pose_23_636696466107567212.jpg",
  "./assets/poses/fun/pose_29_765893480360042501.jpg",
  "./assets/poses/fun/pose_31_1104789352377949103.jpg",
  "./assets/poses/fun/pose_33_685813849536848702.jpg",
  "./assets/poses/fun/pose_34_953355814894282576.jpg",
  "./assets/poses/fun/pose_39_1113163232945986751.jpg",
  "./assets/poses/fun/pose_40_979110775265290417.jpg",
  "./assets/poses/meme/pose_01_303148618688828087.jpg",
  "./assets/poses/meme/pose_02_981503312574337152.jpg",
  "./assets/poses/meme/pose_03_1034842820655989193.jpg",
  "./assets/poses/meme/pose_06_814377545146567367.jpg",
  "./assets/poses/meme/pose_08_358739926580442096.jpg",
  "./assets/poses/meme/pose_09_1125055550641462163.jpg",
  "./assets/poses/meme/pose_10_924082417316204325.jpg",
  "./assets/poses/meme/pose_11_1145814330208344155.jpg",
  "./assets/poses/meme/pose_24_742460688567030059.jpg",
  "./assets/poses/meme/pose_25_990369774802304326.jpg",
  "./assets/poses/meme/pose_26_977633031630608574.jpg",
  "./assets/poses/meme/pose_32_1118722363703947686.jpg",
  "./assets/poses/meme/pose_36_436567757601171051.jpg",
  "./assets/poses/meme/pose_37_711287334938549232.jpg",
  "./assets/poses/meme/pose_38_915075218013265412.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);
      await Promise.allSettled(
        POSE_IMAGES.map((url) =>
          cache.add(url).catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== FONT_CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Google Fonts: Stale-While-Revalidate
  if (
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((res) => {
            if (res && res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || networkPromise;
      })
    );
    return;
  }

  // Only handle same-origin requests beyond fonts
  if (url.origin !== self.location.origin) return;

  // Pose photos: Cache-First for instant offline gacha
  if (url.pathname.includes("/assets/poses/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  // Navigation requests: Network-First, fallback to cached index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put("./index.html", copy));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("./index.html")) || (await cache.match("./"));
        })
    );
    return;
  }

  // App shell (CSS, JS, manifest, icons): Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (
          (await cache.match(request)) ||
          (await cache.match(request, { ignoreSearch: true }))
        );
      })
  );
});
