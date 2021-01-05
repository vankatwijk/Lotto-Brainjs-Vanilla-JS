// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

// workbox.routing.registerRoute(
//     ({request}) => request.destination === 'image',
//     new workbox.strategies.CacheFirst()
// );


// // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
// workbox.routing.registerRoute(
//     // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
//     ({ request }) =>
//       request.destination === 'style' ||
//       request.destination === 'script' ||
//       request.destination === 'worker',
//     // Use a Stale While Revalidate caching strategy
//     new workbox.strategies.StaleWhileRevalidate({
//       // Put all cached files in a cache named 'assets'
//       cacheName: 'assets',
//       plugins: [
//         // Ensure that only requests that result in a 200 status are cached
//         new workbox.cacheableResponse.CacheableResponsePlugin({
//           statuses: [200],
//         }),
//       ],
//     }),
//   );



var CACHE_STATIC_NAME = 'static-v10';
var CACHE_DYNAMIC_NAME = 'dynamic-v10';

// precaching
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function (cache) {
      console.log('[Service Worker] Precaching App Shell');
      //add and addall will let the request happen then cache the response
      cache.addAll([
        '/',
        '/index.html',
        '/script.js',
        '/localforage.js',
        '/init-firebase.js',
        '/browserbrain.js',
        '/favicon.ico',
        '/logo.png',
        '/manifest-icon-192.png',
        '/manifest-icon-512.png',
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com/css2?family=Monoton&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.2/vue.min.js',
        'https://cdn.jsdelivr.net/npm/sortablejs@1.8.4/Sortable.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.20.0/vuedraggable.umd.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css',
        'https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js',
        'https://www.gstatic.com/firebasejs/8.2.0/firebase-analytics.js',
        'https://www.gstatic.com/firebasejs/8.1.2/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/8.1.2/firebase-firestore.js'
      ]);
    })
  )
});

//clear old cache to force the app to refresh
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        //check if new cache does not match old cach name
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

//triggered when ever a fatch request is made, all assets img src are done with fetch
self.addEventListener('fetch', function (event) {

  event.respondWith(
    //event.request = request url , search in any cache folder
    caches.match(event.request)
    .then(function (response) {
      //if it exist in the cache use it
      if (response) {
        return response;
      } else {
        //if not make the request and then store it
        return fetch(event.request)
          .then(function (res) {
            //store dynamic data in a new cache
            return caches.open(CACHE_DYNAMIC_NAME)
              .then(function (cache) {
                //put will cach a resquest thats done already
                //note you can only use the res once thats why we use clone
                cache.put(event.request.url, res.clone());
                return res;
              })
          })
          .catch(function (err) {

          });
      }
    })
  );
});

importScripts("https://unpkg.com/brain.js@2.0.0-beta.2/dist/brain-browser.min.js");
importScripts("localforage.js");

// console.log(self.brain);
// If the "hi" message is posted, say hi back
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PREDICT_NEXT_GROUP') {
    console.log('hi there');
    let net = new brain.recurrent.LSTMTimeStep({
      inputSize: event.data.length,
      hiddenLayers: [10],
      outputSize: event.data.length,
    });

    net.train(event.data.groupSequence);

    //   const notification = new Notification("New message incoming", {
    //     body: "Hi there. How are you doing?",
    //     icon: "logo.png"
    //  })
    self.registration.showNotification('Prediction', {
      body: 'I am done predicting the next group for ' + event.data.selectedWorkplace.name,
      icon: 'logo.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'vibration-sample'
    });

    //instead of run you can use forecast
    output = net.run(event.data.groupSequence);

    let result = [];

    for (let out of [...output]) {
        let n = 0;
        if (out < 0) n = 0;
        else n = Math.round(+out);
        result.push(n)
    }

    //update the indexdb
    localforage.getItem('workplaces', (err, workplaces) => {
      console.log('service worker',workplaces);
      console.log('service worker',event.data.selectedWorkplace);
      console.log('service worker',result);
    
      let foundIndex = workplaces.findIndex(x => x.name == event.data.selectedWorkplace.name);
      workplaces[foundIndex].nextGroupResult = result;
      //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));


      localforage.setItem('workplaces', workplaces, function(err, result) {
      });
    });    

    //set a flag to let the app know if its been remounted that it needs to save the data
    localforage.setItem('service-worker-indexdb-updates', true, function(err, result) {
    });


    event.source.postMessage(output);


  }
});