// DocuStudio Service Worker
const CACHE_NAME = 'docustudio-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pricing.html',
  '/contact.html',
  '/blog.html',
  '/dashboard.html',
  '/pdf-viewer.html',
  '/text-editor.html',
  '/pdf-editor-tools.html',
  '/document-viewers.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  'https://cdn.quilljs.com/1.3.7/quill.min.js',
  'https://cdn.quilljs.com/1.3.7/quill.snow.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pptxjs/0.1.7/pptx.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/epubjs/0.3.93/epub.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
  'https://js.paystack.co/v1/inline.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js'
];

// ====== INSTALL ======
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets...');
        return cache.addAll(STATIC_ASSETS)
          .catch((err) => {
            console.warn('[Service Worker] Some assets failed to cache:', err);
          });
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
  );
});

// ====== ACTIVATE ======
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activated and controlling all clients');
      return self.clients.claim();
    })
  );
});

// ====== FETCH ======
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests (except CDN/fonts)
  if (event.request.url.startsWith('http') && !event.request.url.startsWith('https://docustudio.vercel.app') && 
      !event.request.url.includes('fonts.googleapis.com') && !event.request.url.includes('fonts.gstatic.com') &&
      !event.request.url.includes('cdnjs.cloudflare.com') && !event.request.url.includes('unpkg.com') &&
      !event.request.url.includes('js.paystack.co') && !event.request.url.includes('gstatic.com')) {
    return fetch(event.request);
  }

  // Don't cache API calls or webhooks
  if (url.pathname.includes('/api/')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          // If it's an HTML page, check for updates in background
          if (event.request.headers.get('accept')?.includes('text/html')) {
            // Re-fetch in background to update cache
            fetch(event.request)
              .then((response) => {
                if (response && response.status === 200) {
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                  });
                }
              })
              .catch(() => {});
          }
          return cachedResponse;
        }

        // If not cached, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if it's not a success response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If offline and it's an HTML request, show offline page
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// ====== SKIP WAITING ======
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] Loaded successfully!');