const CACHE_NAME = 'sensei-hub-v2';
const ASSETS_TO_CACHE = [
  '/offline.html',
  '/manifest.json',
  '/images/sensei-mascot.png',
  '/images/mascot-robot.png',
  '/images/cosmic-bg.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key.startsWith('sensei-hub-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Web Push 受信。サーバーが送る JSON ペイロードを通知として表示する。
self.addEventListener('push', (event) => {
  let payload = { title: 'Sensei Hub', body: '', url: '/' };
  try {
    if (event.data) payload = Object.assign(payload, event.data.json());
  } catch (e) {
    if (event.data) payload.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Sensei Hub', {
      body: payload.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: payload.url || '/' },
      tag: 'sensei-reminder',
      renotify: true,
    })
  );
});

// 通知をタップしたらアプリを前面に出す（既存ウィンドウがあれば focus、無ければ開く）。
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate && client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

function getNormalizedUrl(request) {
  const url = new URL(request.url);
  url.searchParams.delete('_rsc');
  // Append unique query parameter to isolate RSC data responses from HTML page responses in the cache
  url.searchParams.set('__next_rsc', '1');
  return url.toString();
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // オフライン対応: 閲覧済みのレッスン本文・レッスン一覧・ニュースの GET は
  // network-first（取得できたら更新キャッシュ、オフライン時はキャッシュを返す）。
  // 進捗同期・チャット・モデル取得などの動的 API はキャッシュしない。
  const isCacheableData =
    isSameOrigin &&
    event.request.method === 'GET' &&
    (
      /^\/api\/subject\/[^/]+\/lessons?$/.test(url.pathname) ||
      url.pathname === '/api/news'
    );

  if (isCacheableData) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone))
              .catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Skip non-GET requests, dynamic API endpoints, Next.js development paths, and external cross-origins
  if (
    event.request.method !== 'GET' ||
    !isSameOrigin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.includes('webpack') ||
    url.pathname.includes('hot-update') ||
    url.pathname.startsWith('/_next/static/development/')
  ) {
    return;
  }

  const isNextData = 
    url.pathname.startsWith('/_next/data/') || 
    url.searchParams.has('_rsc') ||
    event.request.headers.get('RSC') === '1';

  const isNavigation = event.request.mode === 'navigate';

  let cacheWriteResolve;
  const cacheWritePromise = new Promise((resolve) => {
    cacheWriteResolve = resolve;
  });
  event.waitUntil(cacheWritePromise);

  const finishWrite = () => {
    if (cacheWriteResolve) {
      cacheWriteResolve();
      cacheWriteResolve = null;
    }
  };

  // Guarantee promise resolution under all scenarios within 10 seconds
  setTimeout(finishWrite, 10000);

  // Network-First for page navigations and Next.js client-side routing data (RSC)
  if (isNavigation || isNextData) {
    const cacheKey = isNextData ? getNormalizedUrl(event.request) : event.request;

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(cacheKey, responseToCache))
              .catch((err) => console.warn('Cache write failed:', err))
              .finally(finishWrite);
          } else {
            finishWrite();
          }
          return response;
        })
        .catch(() => {
          finishWrite();
          return caches.match(cacheKey, { ignoreSearch: isNavigation }).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return isNavigation ? caches.match('/offline.html') : undefined;
          });
        })
    );
    return;
  }

  // Identify static assets (images, optimized images, fonts, scripts, stylesheets)
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.webp') ||
    ASSETS_TO_CACHE.includes(url.pathname);

  // Cache-First for static assets (excluding dynamic data)
  if (isStaticAsset) {
    const isHashedAsset = url.pathname.startsWith('/_next/static/');

    if (isHashedAsset) {
      // Cache-First for hashed assets (never change)
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            finishWrite();
            return cachedResponse;
          }

          return fetch(event.request).then((response) => {
            if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache))
                .catch((err) => console.warn('Cache write failed:', err))
                .finally(finishWrite);
            } else {
              finishWrite();
            }
            return response;
          }).catch((err) => {
            finishWrite();
            throw err;
          });
        })
      );
    } else {
      // Stale-While-Revalidate for non-hashed static assets (images, manifest, icons)
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((response) => {
            if (
              response &&
              response.status === 200 &&
              (response.type === 'basic' || response.type === 'cors')
            ) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache))
                .catch((err) => console.warn('Cache write failed:', err))
                .finally(finishWrite);
            } else {
              finishWrite();
            }
            return response;
          }).catch((err) => {
            finishWrite();
            throw err;
          });

          if (cachedResponse) {
            fetchPromise.catch(() => {});
            return cachedResponse;
          }

          return fetchPromise;
        })
      );
    }
  } else {
    // Let non-static and non-navigational queries bypass the service worker natively
    finishWrite();
  }
});
