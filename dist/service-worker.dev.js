"use strict";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
workbox.routing.registerRoute(function (_ref) {
  var request = _ref.request;
  return request.destination === 'image';
}, new workbox.strategies.CacheFirst());