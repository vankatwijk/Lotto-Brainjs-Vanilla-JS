"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var app = new Vue({
  el: '#app',
  components: {
    draggable: window['vuedraggable']
  },
  data: {
    darkmode: null,
    loading: false,
    loadinggroups: false,
    refDate: true,
    net: 0,
    tD: 0,
    lastDraw: 0,
    lastResult: 0,
    lengthrow: 5,
    numberballs: 50,
    layers: '5,5,6',
    result_group: "",
    result_group_winning: "",
    result_group_winningAndRef: "",
    result_group_refs: "",
    result_group_numbers: [],
    result_group_numbersToPlay: [],
    result_group_selected_number: [],
    diagram: "",
    output: "",
    inputData: "\n        3\t8\t16\t40\t43\t1\n        1\t29\t33\t45\t47\t2\n        14\t27\t39\t46\t48\t3\n        5\t25\t34\t48\t50\t4\n        15\t27\t33\t39\t50\t5\n        ",
    subgroups: {
      'All': {
        winning: [],
        winningAndRef: [],
        refs: []
      }
    },
    selectedGroup: '',
    groupKeys: [],
    workplaces: [],
    selectedWorkplace: {},
    matrix: [],
    //firebase services
    showLogin: true,
    AppInFire: false,
    fireEmail: ''
  },
  beforeCreate: function beforeCreate() {
    var workplaces = JSON.parse(localStorage.getItem('workplaces'));
    var workplacesBackup = JSON.parse(localStorage.getItem('workplacesBackup')); //--------------------------------------------------------------------
    // create a backup just incase the login destroys everything
    //--------------------------------------------------------------------

    console.log('Workplaces Backup', workplaces);

    if (workplaces && !workplacesBackup) {
      //if there are workplaces then back it up
      localStorage.setItem('workplacesBackup', JSON.stringify(workplaces));
    }
  },
  created: function created() {
    var _this = this;

    this.AppInFire = eval(localStorage.getItem('AppInFire'));
    this.darkmode = eval(localStorage.getItem('darkmode'));
    var workplaces = JSON.parse(localStorage.getItem('workplaces'));
    console.log('mounted - workplaces', workplaces); //--------------------------------------------------------------------
    //--------------------------------------------------------------------
    // Confirm the link is a sign-in with email link.
    //--------------------------------------------------------------------
    //--------------------------------------------------------------------

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = localStorage.getItem('emailForSignIn');

      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      } // The client SDK will parse the code from the link for you.


      firebase.auth().signInWithEmailLink(email, window.location.href).then(function (result) {
        // Clear email from storage.
        //localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        // Identifier
        _this.AppInFire = true;
        _this.showLogin = false;
        _this.fireEmail = result.user.email;
        localStorage.setItem('AppInFire', true);
        console.log('result', result.user.email);

        if (result.additionalUserInfo.isNewUser) {
          //if this is a new user take current localstorage and add it to the firestore
          db.collection(result.user.email).doc('workplaces').set({
            data: JSON.stringify(workplaces)
          }).then(function (docRef) {
            console.log("Document written with ID: ", docRef);
          })["catch"](function (error) {
            console.error("Error adding document: ", error);
          });
        } else {
          //if its already an existing login take the data from the firestore   .doc("workplaces")
          console.log("already have account:", result.user.email);
          var docRef = db.collection(result.user.email).doc("workplaces");
          docRef.get().then(function (doc) {
            if (doc.exists) {
              console.log("workplaces data:", doc.data());
              localStorage.setItem('workplaces', JSON.parse(doc.data().data));
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          }).then(function () {
            _this.workplaces = JSON.parse(localStorage.getItem('workplaces'));
          })["catch"](function (error) {
            console.log("Error getting document:", error);
          });
        }
      })["catch"](function (error) {
        console.log("Firestore error :", error); // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
    } else {
      //if this is in demo mode
      if (workplaces === null) {
        this.workplaces.push({
          name: 'General',
          refDate: true,
          inputData: "\n                        3\t8\t16\t40\t43\t1\n                        1\t29\t33\t45\t47\t2\n                        14\t27\t39\t46\t48\t3\n                        5\t25\t34\t48\t50\t4\n                        15\t27\t33\t39\t50\t5\n                        ",
          layers: '5,5,6',
          lengthrow: 5,
          numberballs: 50,
          groupsConfig: '10,20,30,40,50'
        });
        localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
      } else {
        this.workplaces = workplaces;
      }
    } //--------------------------------------------------------------------
    //--------------------------------------------------------------------
    //--------------------------------------------------------------------
    //--------------------------------------------------------------------

  },
  computed: {},
  methods: {
    //firebase services
    getUrlVars: function getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
      });
      return vars;
    },
    logout: function logout() {
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        this.showLogin = true;
        this.fireEmail = '';
        localStorage.setItem('workplaces', '');
      })["catch"](function (error) {// An error happened.
      });
    },
    fireSignin: function fireSignin() {
      var _this2 = this;

      var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'http://lotto.hpvk.com',
        // This must be true.
        handleCodeInApp: true
      };
      localStorage.setItem('emailForSignIn', this.fireEmail);
      firebase.auth().sendSignInLinkToEmail(this.fireEmail, actionCodeSettings).then(function () {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        localStorage.setItem('emailForSignIn', _this2.fireEmail);
      })["catch"](function (error) {
        // Some error occurred, you can inspect the code: error.code
        console.log(error);
      });
      alert('check your email for a login link !');
    },
    //app
    selectnumber: function selectnumber(selectednumber) {
      if (this.result_group_selected_number.includes(selectednumber)) {
        //remove number
        this.result_group_selected_number = this.result_group_selected_number.filter(function (item) {
          return item !== selectednumber;
        });
      } else {
        //add number
        this.result_group_selected_number.push(selectednumber);
      }
    },
    getMatrixValueWithTableFormate: function getMatrixValueWithTableFormate(row, col) {
      var value = this.getMatrixValue(row, col);
      return value > 0 ? "<b style='color:red'>" + value + "</b>" : "<span style='color:grey'>" + value + "</span>";
    },
    getMatrixValue: function getMatrixValue(row, col) {
      if (this.matrix[row] === undefined) {
        return 0;
      }

      if (this.matrix[row][col] === undefined) {
        return 0;
      }

      if (this.matrix[row][col] === null) {
        return 0;
      }

      return this.matrix[row][col];
    },
    addWorkPlace: function addWorkPlace() {
      var workplaceName = prompt("Please enter a name For the Tab:", "");

      if (workplaceName == null || workplaceName == "") {
        alert("the name can not be empty !");
      } else if (this.workplaces.find(function (o) {
        return o.name === workplaceName;
      })) {
        alert("Name already exist !");
      } else {
        this.workplaces.push({
          name: workplaceName,
          refDate: true,
          inputData: "3	8	16	40	43	1 1	29	33	45	47	2 14	27	39	46	48	3 5	25	34	48	50	4 15	27	33	39	50	5",
          layers: '5,5,6',
          lengthrow: 5,
          numberballs: 50,
          groupsConfig: '10,20,30,40,50'
        });
        localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
      }
    },
    changeWorkPlace: function changeWorkPlace(item) {
      this.selectedWorkplace = item;
      this.selectedGroup = "";
      this.diagram = "";
      this.output = "";

      if (item.groups !== undefined) {
        //if groups where created previously, load them
        this.matrix = item.matrix;
        this.subgroups = item.groups;
      } else {
        //autogenerate the groups
        setTimeout(this.createGroups(), 5000);
      }
    },
    saveWorkPlace: function saveWorkPlace() {
      var _this3 = this;

      var foundIndex = this.workplaces.findIndex(function (x) {
        return x.name == _this3.selectedWorkplace.name;
      });
      this.workplaces[foundIndex] = this.selectedWorkplace;
      localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

      if (this.AppInFire) {
        db.collection(this.fireEmail).doc("workplaces").set({
          data: JSON.stringify(localStorage.getItem('workplaces'))
        }).then(function (docRef) {
          console.log("Document written with ID: ", docRef);
        })["catch"](function (error) {
          console.error("Error adding document: ", error);
        });
      }
    },
    renameWorkPlace: function renameWorkPlace() {
      var _this4 = this;

      var workplaceName = prompt("Please enter a name For the Tab:", this.selectedWorkplace.name);

      if (workplaceName == null || workplaceName == "") {
        alert("the name can not be empty !");
      } else if (this.workplaces.find(function (o) {
        return o.name === workplaceName;
      })) {
        alert("Name already exist !");
      } else {
        var foundIndex = this.workplaces.findIndex(function (x) {
          return x.name == _this4.selectedWorkplace.name;
        });
        this.workplaces[foundIndex].name = workplaceName;
        localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
      }

      this.saveWorkPlace();
    },
    removeWorkPlace: function removeWorkPlace() {
      var _this5 = this;

      if (confirm("Are you sure you want to delete this workplace")) {
        txt = "You pressed OK!";

        if (this.workplaces.length === 1) {
          alert("You can not remove the last workplace !");
        } else {
          var filteredWorkplaces = this.workplaces.filter(function (x) {
            return x.name !== _this5.selectedWorkplace.name;
          });
          this.workplaces = filteredWorkplaces;
          localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
        }
      } else {
        txt = "You pressed Cancel!";
      }
    },
    //https://stackoverflow.com/questions/39927452/recursively-print-all-permutations-of-a-string-javascript
    permut: function (_permut) {
      function permut(_x) {
        return _permut.apply(this, arguments);
      }

      permut.toString = function () {
        return _permut.toString();
      };

      return permut;
    }(function (string) {
      if (string.length < 2) return string; // This is our break condition

      var permutations = []; // This array will hold our permutations

      for (var i = 0; i < string.length; i++) {
        var _char = string[i]; // Cause we don't want any duplicates:

        if (string.indexOf(_char) != i) // if char was used already
          continue; // skip it this time

        var remainingString = string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = permut(remainingString)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var subPermutation = _step.value;
            permutations.push(_char + subPermutation);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return permutations;
    }),
    clean: function clean(s) {
      r = s.replace(/\D/g, ' ');
      r = r.replace(/\s\s+/g, ' ');
      return r;
    },
    zpadlen: function zpadlen(n, len) {
      return ("00000" + n).slice(-len);
    },
    zpad: function zpad(n) {
      return ("0000" + n).slice(-4);
    },
    zpad2: function zpad2(n) {
      return ("0000" + n).slice(-2);
    },
    zpad3: function zpad3(n) {
      return ("0000" + n).slice(-3);
    },
    zpad4: function zpad4(n) {
      return ("0000" + n).slice(-4);
    },
    sumstr: function sumstr(s) {
      r = 0;

      for (i = 0; i < s.length; i++) {
        r += parseInt(s[i]);
      }

      return r;
    },
    rootstr: function rootstr(s) {
      n = parseInt(s);

      while (n > 9) {
        n = sumstr(n + "") + "";
        n = parseInt(n);
      }

      return n;
    },
    tablerow: function tablerow(row) {
      r = "<tr>";

      for (i = 0; i < row.length; i++) {
        r += "<td align='center'>" + row[i] + "</td>";
      }

      r += "</tr>";
      return r;
    },
    addstr: function addstr(s1, s2) {
      r = "";

      for (i = 0; i < s1.length; i++) {
        r += "" + (parseInt(s1[i]) + parseInt(s2[i])) % 10;
      }

      return r;
    },
    subarr: function subarr(a1, a2) {
      r = [];

      for (i = 0; i < a1.length; i++) {
        r.push(parseInt(a1[i]) - parseInt(a2[i]));
      }

      return r;
    },
    addarr: function addarr(a1, a2) {
      r = [];

      for (i = 0; i < a1.length; i++) {
        r.push(parseInt(a1[i]) + parseInt(a2[i]));
      }

      return r;
    },
    bracket_if_match: function bracket_if_match(str, n) {
      r = [];

      for (var i = 0; i < str.length; i++) {
        if (parseInt(str[i]) == parseInt(n)) {
          r.push("(" + str[i] + ")");
        } else {
          r.push(str[i]);
        }
      }

      return r;
    },
    mirror: function mirror(n) {
      n = "" + n;
      r = "";

      for (var i = 0; i < n.length; i++) {
        r += (parseInt(n[i]) + 5) % 10 + "";
      }

      return r;
    },
    mirrorarr: function mirrorarr(ar) {
      var r = [];

      for (var i = 0; i < ar.length; i++) {
        r.push(mirror(ar[i]));
      }

      return r;
    },
    intarr: function intarr(ar) {
      var re = [];

      for (var i = 0; i < ar.length; i++) {
        re.push(parseInt(ar[i]));
      }

      return re;
    },
    lotmat: function lotmat(ar) {
      re = 0;

      for (i = 0; i < ar.length; i++) {
        re += parseInt(ar[i]);
      }

      re = re % 10;
      return re;
    },
    createnetwork: function createnetwork() {
      hidlayers = eval("[" + this.selectedWorkplace.layers + "]");
      this.net = new brain.NeuralNetwork({
        hiddenLayers: hidlayers
      });
      outputt = "Neural Net created with Hidden Layers Shape [" + hidlayers.join(",") + "]<br/>";
      this.output = outputt;
    },
    reverseInputLines: function reverseInputLines() {
      input = this.selectedWorkplace.inputData;
      input = input.split("\n");
      input = input.reverse();
      input = input.join("\n");
      this.selectedWorkplace.inputData = input;
    },
    highestProb: function highestProb(result) {
      var print = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      orderlst = [];

      for (var i = 0; i < result.length; i++) {
        orderlst.push([i + 1, result[i]]);
      }

      orderlst = orderlst.sort(function (a, b) {
        return b[1] - a[1];
      });
      lst = [];

      if (print == 1) {
        this.output += "Highest probability is: " + orderlst[0][1] + "<br/>";
        this.output += "Lowest probability is: " + orderlst[orderlst.length - 1][1] + "<br/>";
      }

      for (var i = 0; i < orderlst.length; i++) {
        lst.push(orderlst[i][0]);
      }

      return lst;
    },
    runapp: function runapp() {
      var _this6 = this;

      this.loading = true; //give time to load the loading animation

      setTimeout(function () {
        _this6.trainnetwork();
      }, 500); //one sec
    },
    trainnetwork: function trainnetwork() {
      //for (var i=0;i<1;i++){
      //give time to load the loading animation
      stats = this.net.train(this.tD);
      this.output = "Error:" + stats["error"] + " Iterations: " + stats['iterations'];
      this.output += "<br/>Trained.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";
      this.diagram = brain.utilities.toSVG(this.net);
      this.runthrough();
    },
    runthrough: function runthrough() {
      lengthrow = +this.selectedWorkplace.lengthrow;
      result = this.net.run(this.lastResult);
      ordlst = this.highestProb(result);
      numbersToPlay = ordlst.slice(0, lengthrow);
      this.result_group_numbersToPlay = numbersToPlay;
      this.output += "From most likely to least likely: " + ordlst.join(', ') + "<br/>"; //this.output += "Numbers to play: <b>" + numbersToPlay.join(' ') + "</b><br/>";

      this.output += "Numbers to play: <b>";
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = numbersToPlay.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              _index = _step2$value[0],
              _val = _step2$value[1];

          this.output += "<span class='table-number-to-play'>" + _val + "</span>";
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.output += "</b><br/>";
      this.output += "Here are 10 sets ran in series:<br/>";
      nextResult = this.lastResult;
      balls = ordlst.length;
      numbers = numbersToPlay.length;
      this.output += "<table class='table' style='background-color: white; margin-top: 20px;'><tbody>";

      for (var i = 0; i < lengthrow; i++) {
        result = this.net.run(nextResult);
        ordlst = this.highestProb(result, print = 0);
        thisSet = ordlst.slice(0, numbers); // this.output += "<b>"+thisSet.join(" ")+"</b><br/>";
        // nextResult = this.tD_Ones(balls,thisSet);

        this.output += "<tr>";
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = thisSet.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                index = _step3$value[0],
                val = _step3$value[1];

            this.output += "<td>" + val + "</td>";
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        this.output += "</tr>";
        nextResult = this.tD_Ones(balls, thisSet);
      }

      this.output += "</tbody></table>";
      this.loading = false;
    },
    trainnetwork100: function trainnetwork100() {
      for (var i = 0; i < 100; i++) {
        this.net.train(this.tD);
      }

      this.output = "<br/>Trained 100x.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";
      this.runthrough();
    },
    trainnetwork1000: function trainnetwork1000() {
      for (var i = 0; i < 1000; i++) {
        this.net.train(this.tD);
      }

      this.output = "<br/>Trained 1000x.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";
      this.runthrough();
    },
    readtrainingdata: function readtrainingdata() {
      this.run();
    },
    tD_Ones: function tD_Ones(size, row) {
      var res = [];

      for (var i = 0; i < size; i++) {
        res.push(0);
      }

      for (var i = 0; i < row.length; i++) {
        curindex = parseInt(row[i]) - 1;
        res[curindex] = 1;
      }

      return res;
    },
    changeResultGroup: function changeResultGroup(name, values) {
      var _this7 = this;

      this.selectedGroup = name;
      this.result_group = values.winning;
      this.result_group_winning = values.winning.join(" ");
      this.result_group_winningAndRef = values.winningAndRef;
      this.result_group_refs = values.refs;
      this.result_group_numbers = values.numbers;
      console.log('change group values', values);

      if (values.output !== undefined) {
        setTimeout(function () {
          console.log('change group values', values.output);
          _this7.diagram = values.diagram;
          _this7.output = values.output;
          _this7.result_group_numbersToPlay = values.result_group_numbersToPlay;
        }, 300);
      } else {
        this.result_group_numbersToPlay = [];
      }
    },
    generateProportionTable: function generateProportionTable() {},
    generateProportionMatrix: function generateProportionMatrix(winningRow) {
      lengthrow = +this.selectedWorkplace.lengthrow;

      for (var m = 0; m < lengthrow; m++) {
        if (this.matrix[winningRow[m]] === undefined) {
          this.matrix[winningRow[m]] = [];
        }

        if (this.matrix[winningRow[m]][m] === undefined) {
          this.matrix[winningRow[m]][m] = 1;
        } else {
          this.matrix[winningRow[m]][m] += 1;
        }
      }
    },
    createGroups: function createGroups() {
      var _this8 = this;

      //reset default values
      this.matrix = [];
      this.result_group = "";
      this.result_group_winning = "";
      this.result_group_winningAndRef = "";
      this.result_group_refs = "";
      this.result_group_numbers = [];
      this.result_group_numbersToPlay = [];
      this.saveWorkPlace(); //clear previous groups

      this.subgroups = {
        'All': {
          winning: [],
          winningAndRef: [],
          refs: [],
          numbers: []
        }
      }; // put them in groups of 6 for each item
      //create rows here

      check = this.selectedWorkplace.inputData;
      check = this.clean(check);
      checks = check.split(" ");
      var filtered = checks.filter(function (el) {
        //filter out empty
        return el != "";
      });
      inputs = filtered;
      lengthrow = +this.selectedWorkplace.lengthrow; //group sequence is used to predict the next group

      var groupSequence = [];

      var _loop = function _loop() {
        //use last column as date ref column filter out the other numbers as winnings
        if (i === 0 || _this8.selectedWorkplace.refDate === false) {
          input = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);

          _this8.generateProportionMatrix(input);
        } else {
          input = inputs.slice(i * (lengthrow + 1), i * (lengthrow + 1) + lengthrow);

          _this8.generateProportionMatrix(input);
        } //input = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);


        if (_this8.selectedWorkplace.refDate === true) {
          inputWithRef = inputs.slice(i * (lengthrow + 1), i * (lengthrow + 1) + (lengthrow + 1));
          ref = inputs[i * lengthrow + (lengthrow + i)];
        } else {
          inputWithRef = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
          ref = i;
        } //get the ref column


        if (_this8.selectedWorkplace.refDate === true) {
          inputRef = inputs[i * lengthrow];
        }

        groupsConfig1 = _this8.selectedWorkplace.groupsConfig;
        groupsConfig = groupsConfig1.split(",");
        var groupNumbers = [];
        var subname = []; //for (var j=0;j<lengthrow;j++){

        for (j = 0; j < groupsConfig.length; j++) {
          subname.push(0);
        }

        input.forEach(function (element) {
          var triggered = false;
          groupNumbers.push(element);
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = groupsConfig.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _step4$value = _slicedToArray(_step4.value, 2),
                  index = _step4$value[0],
                  val = _step4$value[1];

              if (triggered === false) {
                if (+element <= +val) {
                  subname[+index] += 1;
                  triggered = true;
                }
              }
            } // if(element < 10){
            //     subname[0] += 1;
            // }else if(element < 20){
            //     subname[1] += 1;
            // }else if(element < 30){
            //     subname[2] += 1;
            // }else if(element < 40){
            //     subname[3] += 1;
            // }else if(element <= 50){
            //     subname[4] += 1;
            // }

          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        });
        groupSequence.push(subname);
        subname = subname.join("-");

        if (_this8.subgroups[subname] === undefined) {
          _this8.subgroups[subname] = {};
          _this8.subgroups[subname].name = '';
          _this8.subgroups[subname].winning = [];
          _this8.subgroups[subname].winningAndRef = [];
          _this8.subgroups[subname].refs = [];
          _this8.subgroups[subname].numbers = [];
        }

        _this8.subgroups[subname].name = subname;

        _this8.subgroups[subname].winning.push(input);

        _this8.subgroups[subname].winningAndRef.push(inputWithRef.join(" "));

        _this8.subgroups[subname].refs.push(ref);

        _this8.subgroups[subname].numbers = [].concat(_toConsumableArray(_this8.subgroups[subname]['numbers']), groupNumbers);

        _this8.groupKeys.push(subname);

        _this8.subgroups.All.name = 'All';

        _this8.subgroups.All.winning.push(input);

        _this8.subgroups.All.winningAndRef.push(inputWithRef.join(" "));

        _this8.subgroups.All.refs.push(ref);

        _this8.subgroups.All.numbers = [].concat(_toConsumableArray(_this8.subgroups.All.numbers), groupNumbers);
      };

      for (var i = 0; i < Math.floor(inputs.length / (lengthrow + (this.selectedWorkplace.refDate ? 1 : 0))); i++) {
        var groupsConfig1;
        var groupsConfig;
        var j;

        _loop();
      } //save groups to localstorage


      this.selectedWorkplace.groups = this.subgroups;
      this.selectedWorkplace.groupSequence = groupSequence;

      if (this.selectedWorkplace.predictnextgroup) {
        this.startpredictNextGroup();
      }

      this.saveWorkPlace();
      console.log('subgroups', this.subgroups); //this.result_group_winning =this.groupKeys.join(" ");
    },
    startpredictNextGroup: function startpredictNextGroup() {
      var _this9 = this;

      this.loadinggroups = true;
      this.selectedWorkplace.nextGroupResult = '';
      setTimeout(function () {
        _this9.predictNextGroup();
      }, 500); //one sec
    },
    predictNextGroup: function predictNextGroup() {
      //with the sequence of groups this function will predict the next group that will come up
      var net = new brain.recurrent.LSTMTimeStep({
        inputSize: this.selectedWorkplace.groupSequence[0].length,
        hiddenLayers: [10],
        outputSize: this.selectedWorkplace.groupSequence[0].length
      });
      net.train(this.selectedWorkplace.groupSequence); //instead of run you can use forecast

      var output = net.run(this.selectedWorkplace.groupSequence);
      var result = [];

      for (var _i2 = 0, _arr2 = _toConsumableArray(output); _i2 < _arr2.length; _i2++) {
        var out = _arr2[_i2];
        var _n2 = 0;
        if (out < 0) _n2 = 0;else _n2 = Math.round(+out);
        result.push(_n2);
      }

      this.selectedWorkplace.nextGroupResult = result;
      this.saveWorkPlace();
      this.loadinggroups = false;
    },
    run: function run() {
      outputt = ""; //check these numbers in 'check' element
      //lastdraw =  .getElementById('draw').value;

      check = this.result_group_winning;
      check = this.clean(check);
      checks = check.split(" ");
      var filtered = checks.filter(function (el) {
        //filter out empty
        return el != "";
      });
      checks = filtered;
      inputs = checks; //get row length

      lengthrow = +this.selectedWorkplace.lengthrow; //len = inputs[0].length; //Pick-3/Pick-4 indicator based on len.

      len = lengthrow; // put them in groups of 6 for each item
      //create rows here

      finputs = [];

      for (var i = 0; i < Math.floor(inputs.length / lengthrow); i++) {
        //use last column as date ref column filter out the other numbers as winnings
        input = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
        finputs.push(input);
      }

      inputs = finputs; //inputs = inputs.reverse(); //reverse so that it's from oldest to newest

      balls = this.selectedWorkplace.numberballs;
      this.tD = [];

      for (var i = 0; i < inputs.length - 1; i++) {
        tDin = this.tD_Ones(balls, inputs[i].slice(0, len));
        tDout = this.tD_Ones(balls, inputs[i + 1].slice(0, len));
        this.tD.push({
          input: tDin,
          output: tDout
        });
      }

      this.lastDraw = inputs[inputs.length - 1];
      console.log('[lastDraw]', inputs);
      this.lastResult = this.tD_Ones(balls, this.lastDraw.slice(0, len));
      outputt += "Read training data!";
      this.output = outputt;
    }
  },
  watch: {
    darkmode: function darkmode(val) {
      localStorage.setItem('darkmode', val);

      if (val) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    },
    output: function output(val) {
      //save groups to localstorage
      //console.log('selectedGroup',this.selectedGroup);
      if (val) {
        this.selectedWorkplace.groups[this.selectedGroup].output = this.output;
        this.saveWorkPlace();
      }
    },
    matrix: function matrix(val) {
      //save matrix inside groups in localstorage
      //console.log('matrix',val);
      if (val) {
        this.selectedWorkplace.matrix = this.matrix;
        this.saveWorkPlace();
      }
    },
    diagram: function diagram(val) {
      //save diagram inside groups to localstorage
      //console.log('diagram',this.diagram);
      if (val) {
        this.selectedWorkplace.groups[this.selectedGroup].diagram = this.diagram;
        this.saveWorkPlace();
      }
    },
    result_group_numbersToPlay: function result_group_numbersToPlay(val) {
      //save diagram inside groups to localstorage
      //console.log('diagram',this.diagram);
      if (val && this.selectedGroup) {
        this.selectedWorkplace.groups[this.selectedGroup].result_group_numbersToPlay = val;
        this.saveWorkPlace();
      }
    }
  }
});