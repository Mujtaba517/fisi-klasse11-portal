/* Lernova service worker.
   CACHE is the version. Activate deletes every other cache name.
   Install precaches the app shell and calls skipWaiting(); activate calls clients.claim()
   so an update takes control without waiting for every tab to close.
   HTML navigations are network-first and fall back to the cache, then offline.html.
   Other same-origin GETs are stale-while-revalidate.
   Video files are not intercepted, so range playback stays with the browser,
   and nothing over RUNTIME_BYTE_CAP is written into the runtime cache. */
var CACHE = 'lernova-v2-learning-20261116';
var RUNTIME_BYTE_CAP = 512 * 1024;
var PRECACHE = [
  './learning.css',
  './learning-catalog.js',
  './learning-revised.js',
  './learning-expanded.js',
  './learning-app.js',
  './learning-media.js',
  './lumo-original.js',
  './lumo-motion.js',

  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './appearance.css',
  './login-lumo.css',
  './lumo-site.css',
  './lumo.css',
  './styles.css',
  './admin-panel.js',
  './appearance.js',
  './auth.js',
  './explainers-data.js',
  './grades.js',
  './guide.js',
  './lesson.js',
  './lessons/aeup.js',
  './lessons/bgwp.js',
  './lessons/englisch.js',
  './lessons/fachpraxis.js',
  './lessons/grade-10/aeup.js',
  './lessons/grade-10/bgwp.js',
  './lessons/grade-10/englisch.js',
  './lessons/grade-10/fuit.js',
  './lessons/grade-10/ittechnik.js',
  './lessons/grade-10/projekt.js',
  './lessons/grade-10/pug.js',
  './lessons/it-systeme.js',
  './lessons/it-technik.js',
  './lessons/pug.js',
  './login-lumo.js',
  './lumo.js',
  './profile-link.js',
  './quiz-app.js',
  './quiz-index.js',
  './quiz/aeup.js',
  './quiz/bgwp.js',
  './quiz/englisch.js',
  './quiz/fachpraxis.js',
  './quiz/it-systeme.js',
  './quiz/it-technik.js',
  './quiz/k10-aeup.js',
  './quiz/k10-bgwp.js',
  './quiz/k10-englisch.js',
  './quiz/k10-fuit.js',
  './quiz/k10-ittechnik.js',
  './quiz/k10-projekt.js',
  './quiz/k10-pug.js',
  './quiz/legacy.js',
  './quiz/pug.js',
  './script.js',
  './settings.js',
  './shell.js',
  './supabase-config.js',
  './supabase-lite.js',
  './theme-init.js',
  './users-tab.js',
  './users.js',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/icon-maskable-source.svg',
  './assets/icons/icon-source.svg',
  './admin.html',
  './aeup.html',
  './assets/favicon.svg',
  './assets/fonts/inter-latin.woff2',
  './assets/fonts/vazirmatn-arabic.woff2',
  './assets/lernova-mark.svg',
  './bgwp.html',
  './englisch.html',
  './explainers.html',
  './fachpraxis.html',
  './flashcards.html',
  './it-systeme.html',
  './it-technik.html',
  './k10-aeup.html',
  './k10-bgwp.html',
  './k10-englisch.html',
  './k10-fuit.html',
  './k10-ittechnik.html',
  './k10-projekt.html',
  './k10-pug.html',
  './klasse-10.html',
  './lf6.html',
  './lf7.html',
  './lf8.html',
  './lf9.html',
  './login-lumo.css?v=20261111a',
  './login-lumo.js?v=20261111a',
  './login.html',
  './preview-lumo.html',
  './profile.html',
  './progress.html',
  './pug.html',
  './quiz.html',
  './settings.html',
  './settings.js?v=20261110c',
  './styles.css?v=20261110c'
];

function isHeavyMedia(url) {
  return /\.(?:mp4|webm|m4v|mov|ogv|mkv)(?:$|\?)/i.test(url.pathname);
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

function purgeOldCaches() {
  return caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key !== CACHE;
    }).map(function (key) {
      return caches.delete(key);
    }));
  });
}

self.addEventListener('activate', function (event) {
  event.waitUntil(
    purgeOldCaches().then(function () {
      return self.clients.claim();
    }).then(function () {
      return self.clients.matchAll({ type: 'window' });
    }).then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({ type: 'lernova-sw-active', cache: CACHE });
      });
    })
  );
});

function storeIfSmall(cache, request, response) {
  if (!response || !response.ok || response.type !== 'basic' || response.status === 206) return;
  var type = (response.headers.get('content-type') || '').toLowerCase();
  if (type.indexOf('video/') === 0) return;
  var lenHeader = response.headers.get('content-length');
  var len = lenHeader ? Number(lenHeader) : 0;
  if (len > RUNTIME_BYTE_CAP) return;
  var copy = response.clone();
  if (!len) {
    copy.blob().then(function (blob) {
      if (blob.size > RUNTIME_BYTE_CAP) return;
      cache.put(request, new Response(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })).catch(function () {});
    }).catch(function () {});
    return;
  }
  cache.put(request, copy).catch(function () {});
}

function cachedPage(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return cache.match('./offline.html');
    });
  });
}

function networkFirstNavigation(request) {
  return fetch(request).then(function (response) {
    if (response && response.ok && response.type === 'basic') {
      var copy = response.clone();
      caches.open(CACHE).then(function (cache) {
        cache.put(request, copy).catch(function () {});
      });
    }
    return response;
  }).catch(function () {
    return cachedPage(request).then(function (cached) {
      if (cached) return cached;
      return new Response('<!DOCTYPE html><meta charset="utf-8"><title>Offline | Lernova</title><p>Du bist offline</p>', {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    });
  });
}

function staleWhileRevalidate(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request, { ignoreSearch: true }).then(function (cached) {
      var network = fetch(request).then(function (response) {
        storeIfSmall(cache, request, response);
        return response;
      }).catch(function () {
        return cached;
      });
      if (cached) return cached;
      return network.then(function (response) {
        return response || new Response('', { status: 504, statusText: 'Offline' });
      });
    });
  });
}

self.addEventListener('message', function (event) {
  if (!event.data || event.data.type !== 'lernova-purge-old-caches') return;
  event.waitUntil(purgeOldCaches());
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;
  if (isHeavyMedia(url)) return;
  if (request.headers.has('range')) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});
