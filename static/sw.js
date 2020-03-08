const staticCacheName = 'site-static-offline';
const assets= [
    "/bootstrap-4.3.1-dist/css/bootstrap.css",
    "/bootstrap-4.3.1-dist/js/bootstrap.js",
    "/js/main.js",
    "/js/dom.js",
    "https://code.jquery.com/jquery-3.4.1.min.js",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
    "/offline_page",
    "/js/offlineScript.js"
];

self.addEventListener('install', function (event){
    event.waitUntil(caches.open(staticCacheName)
        .then( cache => {
            console.log('caching'); //
            cache.addAll(assets);
        }));


});
////
//activate serviceWorker
self.addEventListener('activate', function (event){
    // console.log('Service Worker has been activated');
    event.waitUntil(
        caches.keys().then(keys => {
            console.log(keys)
        })
    )
});


//fetch event
self.addEventListener('fetch', function(event){
   // console.log('fetch event', event);
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request);
        }).catch(() => caches.match('/offline_page'))
    )
});


