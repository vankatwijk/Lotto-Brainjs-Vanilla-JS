"use strict";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
workbox.routing.registerRoute(function (_ref) {
  var request = _ref.request;
  return request.destination === 'image';
}, new workbox.strategies.CacheFirst()); // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy

workbox.routing.registerRoute( // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
function (_ref2) {
  var request = _ref2.request;
  return request.destination === 'style' || request.destination === 'script' || request.destination === 'worker';
}, // Use a Stale While Revalidate caching strategy
new workbox.strategies.StaleWhileRevalidate({
  // Put all cached files in a cache named 'assets'
  cacheName: 'assets',
  plugins: [// Ensure that only requests that result in a 200 status are cached
  new workbox.cacheableResponse.CacheableResponsePlugin({
    statuses: [200]
  })]
}));