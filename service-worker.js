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



var CACHE_STATIC_NAME = 'static-v14';
var CACHE_DYNAMIC_NAME = 'dynamic-v14';

// precaching
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then(function(cache) {
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
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
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
self.addEventListener('fetch', function(event) {

    event.respondWith(
        //event.request = request url , search in any cache folder
        caches.match(event.request)
        .then(function(response) {
            //if it exist in the cache use it
            if (response) {
                return response;
            } else {
                //if not make the request and then store it
                return fetch(event.request)
                    .then(function(res) {
                        //store dynamic data in a new cache
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then(function(cache) {
                                //put will cach a resquest thats done already
                                //note you can only use the res once thats why we use clone
                                cache.put(event.request.url, res.clone());
                                return res;
                            })
                    })
                    .catch(function(err) {

                    });
            }
        })
    );
});

importScripts("https://unpkg.com/brain.js@2.0.0-beta.2/dist/brain-browser.min.js");
importScripts("localforage.js");




function clean(s) {
    let r = s.replace(/\D/g, ' ');
    r = r.replace(/\s\s+/g, ' ');
    return r;
}

function tD_Ones(size, row) {
    var res = [];
    for (var i = 0; i < size; i++) {
        res.push(0);
    }
    for (var i = 0; i < row.length; i++) {
        let curindex = parseInt(row[i]) - 1;
        res[curindex] = 1;
    }
    return res;
}

function highestProb(result, print = 1) {
    let orderlst = [];
    let output = ''
    for (var i = 0; i < result.length; i++) {
        orderlst.push([i + 1, result[i]]);
    }
    orderlst = orderlst.sort(function(a, b) {
        return b[1] - a[1]
    });
    let lst = [];
    if (print == 1) {
        output += "Highest probability is: " + orderlst[0][1] + "<br/>";
        output += "Lowest probability is: " + orderlst[orderlst.length - 1][1] + "<br/>";
    }
    for (var i = 0; i < orderlst.length; i++) {
        lst.push(orderlst[i][0]);
    }
    return {
        lst: lst,
        output: output
    };
}


// console.log(self.brain);
// If the "hi" message is posted, say hi back
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PREDICT_NEXT_GROUP') {
        console.log('hi there');
        let net = new brain.recurrent.LSTMTimeStep({
            inputSize: event.data.length,
            hiddenLayers: [20],
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

        new Promise((resolve, reject) => {

            //instead of run you can use forecast
            output = net.run(event.data.groupSequence);
            resolve(output);

        }).then((output) => {
            console.log('promise then', output);




            let result = [];

            for (let out of[...output]) {
                let n = 0;
                if (out < 0) n = 0;
                else n = Math.round(+out);
                result.push(n)
            }

            //update the indexdb
            localforage.getItem('workplaces', (err, workplaces) => {
                console.log('service worker', workplaces);
                console.log('service worker', event.data.selectedWorkplace);
                console.log('service worker', result);

                let foundIndex = workplaces.findIndex(x => x.name == event.data.selectedWorkplace.name);
                workplaces[foundIndex].nextGroupResult = result;
                //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));


                localforage.setItem('workplaces', workplaces, function(err, result) {

                    //-------------------------------------------------

                    console.log('predicted groups ==== done');

                    //set a flag to let the app know if its been remounted that it needs to save the data
                    localforage.setItem('service-worker-indexdb-updates', true, function(err, result) {});

                    console.log('predicted groups', output);
                    event.source.postMessage(output);

                });

            });

        });


    } else if (event.data && event.data.type === 'PREDICT_NEXT_NUMBERS') {
        console.log('hi there, lets predict the next numbers !!!!');
        var output = '';
        var tD = [];
        var lastDraw = null;
        var lastResult = null;

        let hidlayers = eval("[" + event.data.layers + "]");

        var net = new brain.NeuralNetwork({
            hiddenLayers: hidlayers
        });

        //check these numbers in 'check' element
        //lastdraw =  .getElementById('draw').value;
        let check = event.data.result_group_winning;
        check = clean(check);
        let checks = check.split(" ");
        var filtered = checks.filter(function(el) { //filter out empty
            return el != "";
        });
        checks = filtered;


        let inputs = checks;

        //get row length
        var lengthrow = event.data.lengthrow;


        //len = inputs[0].length; //Pick-3/Pick-4 indicator based on len.
        let len = lengthrow;

        // put them in groups of 6 for each item
        //create rows here
        let finputs = [];
        for (var i = 0; i < (Math.floor(inputs.length / lengthrow)); i++) {

            //use last column as date ref column filter out the other numbers as winnings
            let input = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
            finputs.push(input);

        }
        inputs = finputs;

        //inputs = inputs.reverse(); //reverse so that it's from oldest to newest
        let balls = event.data.numberballs;

        tD = [];
        for (var i = 0; i < inputs.length - 1; i++) {
            let tDin = tD_Ones(balls, inputs[i].slice(0, len));
            let tDout = tD_Ones(balls, inputs[i + 1].slice(0, len));
            tD.push({
                input: tDin,
                output: tDout
            });
        }
        lastDraw = inputs[inputs.length - 1];
        console.log('[lastDraw]', inputs);
        lastResult = tD_Ones(balls, lastDraw.slice(0, len));


        new Promise((resolve, reject) => {

            stats = net.train(tD);
            output = "Error:" + stats["error"] + " Iterations: " + stats['iterations'];
            output += "<br/>Trained.<br/>Run with last Draw result: " + lastDraw.join(", ") + "<br/>";
            diagram = brain.utilities.toSVG(net)



            let result = net.run(lastResult);
            let ordlst = (highestProb(result)).lst;
            output += (highestProb(result)).output;
            var numbersToPlay = ordlst.slice(0, lengthrow);

            //remember to set this in the db
            //this.result_group_numbersToPlay = numbersToPlay;


            output += "From most likely to least likely: " + ordlst.join(', ') + "<br/>";
            //this.output += "Numbers to play: <b>" + numbersToPlay.join(' ') + "</b><br/>";
            output += "Numbers to play: <b>";

            for (let [index, val] of numbersToPlay.entries()) {
                output += "<span class='table-number-to-play'>" + val + "</span>";
            }

            output += "</b><br/>";


            output += "Here are 10 sets ran in series:<br/>";
            let nextResult = lastResult;
            let balls = ordlst.length;
            let numbers = numbersToPlay.length;


            output += "<table class='table' style='background-color: white; margin-top: 20px;'><tbody>";
            for (var i = 0; i < lengthrow; i++) {
                result = net.run(nextResult);
                ordlst = (highestProb(result, print = 0)).lst;
                let thisSet = ordlst.slice(0, numbers);

                // this.output += "<b>"+thisSet.join(" ")+"</b><br/>";
                // nextResult = this.tD_Ones(balls,thisSet);

                output += "<tr>";
                for (let [index, val] of thisSet.entries()) {
                    this.output += "<td>" + val + "</td>";
                }
                output += "</tr>";
                nextResult = tD_Ones(balls, thisSet);
            }

            output += "</tbody></table>";


            resolve({
                numbersToPlay: numbersToPlay,
                output: output,
                diagram: diagram
            });

        }).then((result) => {

            self.registration.showNotification('Prediction', {
                body: 'the numbers you should play next are :' + result.numbersToPlay,
                icon: 'logo.png',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample'
            });

            //update the indexdb
            localforage.getItem('workplaces', (err, workplaces) => {
                console.log('service worker', workplaces);
                console.log('service worker', event.data.selectedWorkplace);
                console.log('service worker', event.data.selectedGroup);
                console.log('service worker', result);

                let foundIndex = workplaces.findIndex(x => x.name == event.data.selectedWorkplace.name);
                workplaces[foundIndex].groups[event.data.selectedGroup].output = result.output;
                //workplaces[foundIndex].groups[event.data.selectedGroup].diagram = result.diagram;
                workplaces[foundIndex].groups[event.data.selectedGroup].numbersToPlay = result.numbersToPlay;
                //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));


                localforage.setItem('workplaces', workplaces, (err, localresult) => {

                    //-------------------------------------------------

                    console.log('predicted numbers ==== done');

                    //set a flag to let the app know if its been remounted that it needs to save the data
                    localforage.setItem('service-worker-indexdb-updates', true, function(err, result) {});

                    console.log('predicted numbers', result.output);
                    event.source.postMessage(result);

                });

            });



        })


    }
});