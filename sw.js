const VERSION = '0.11.6'; // Increment version to force cache refresh
const cacheName = `v${VERSION}::static`;

const fileList = `
./
static/css/main.css
static/images/icon.svg
static/images/apple-touch-icon.png
static/images/icon16.png
static/images/icon32.png
static/images/icon192.png
static/images/icon512.png
static/images/mstile-150x150.png
static/js/app.js
static/js/calendar.js
static/js/config.js
static/js/controller.js
static/js/dates.js
static/js/helpers.js
static/js/model.js
static/js/offline.js
static/js/settings.js
static/js/storage.js
static/js/template.js
static/js/view.js
static/vendor/moment-2.29.4.min.js
static/manifest.webmanifest
`
  .trim()
  .split('\n')
  .filter(Boolean);

self.addEventListener('install', (e) => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache
          .addAll(
            fileList.map((file) => new Request(file, { cache: 'no-cache' }))
          )
          .then(() => {
            self.skipWaiting();
          });
      })
      .then(() => {
        console.log(`offline ${VERSION} ready 🎉`);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // when the browser fetches a url, either response with the cached object
  // or go ahead and fetch the actual url and add it to the cache at the same time
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      const url = event.request;
      return cache
        .match(url)
        .then((res) => {
          return (
            res ||
            fetch(url).then((response) => {
              // check if request is made by chrome extensions or web page, because of some installed chrome extension, service worker throws the error `TypeError: Request scheme 'chrome-extension' is unsupported`
              // https://stackoverflow.com/questions/49157622/service-worker-typeerror-when-opening-chrome-extension
              if (url.url.startsWith('http')) {
                cache.put(url, response.clone());
              }
              return response;
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    })
  );
});

const clearOldCaches = () => {
  return caches.keys().then((keys) => {
    return Promise.all(
      keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
    );
  });
};

const clearAllCaches = () =>
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));

self.addEventListener('activate', (event) => {
  // Clear old caches and claim clients to ensure immediate control
  event.waitUntil(
    clearOldCaches()
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all clients that the service worker has been updated
        return self.clients.matchAll().then(clients => {
          return Promise.all(
            clients.map(client => {
              return client.postMessage({
                type: 'SW_UPDATED',
                version: VERSION
              });
            })
          );
        });
      })
  );
});

self.addEventListener('message', (event) => {
  console.log('sw received message:', event);
  if (event.data.type === 'clear') {
    console.log('delete all caches');
    event.waitUntil(
      clearAllCaches().then(() => {
        // Notify the client that sent the message that caches were cleared
        if (event.source) {
          event.source.postMessage({
            type: 'CACHES_CLEARED',
            success: true
          });
        }
      })
    );
  } else if (event.data.type === 'update') {
    // Force update by clearing caches and reloading files
    event.waitUntil(
      clearAllCaches()
        .then(() => caches.open(cacheName))
        .then(cache => {
          return cache.addAll(
            fileList.map(file => new Request(file, { cache: 'no-cache' }))
          );
        })
        .then(() => {
          console.log(`Service worker updated to version ${VERSION}`);
          if (event.source) {
            event.source.postMessage({
              type: 'UPDATE_COMPLETE',
              version: VERSION
            });
          }
        })
    );
  }
});

// Add a function to check for updates that can be called from the client
const checkForUpdates = () => {
  return fetch('./sw.js', { cache: 'no-cache' })
    .then(response => response.text())
    .then(text => {
      const versionMatch = text.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
      if (versionMatch && versionMatch[1] !== VERSION) {
        return { hasUpdate: true, newVersion: versionMatch[1] };
      }
      return { hasUpdate: false };
    });
};

// Expose the update check function to clients
self.addEventListener('message', event => {
  if (event.data.type === 'CHECK_UPDATES') {
    event.waitUntil(
      checkForUpdates().then(result => {
        if (event.source) {
          event.source.postMessage({
            type: 'UPDATE_CHECK_RESULT',
            ...result
          });
        }
      })
    );
  }
});
