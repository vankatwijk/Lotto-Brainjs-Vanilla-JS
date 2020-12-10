"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var app = new Vue({
  el: '#app',
  data: {
    loading: false,
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
    matrix: []
  },
  mounted: function mounted() {
    var workplaces = JSON.parse(localStorage.getItem('workplaces'));
    console.log('work', workplaces);

    if (workplaces === null) {
      this.workplaces.push({
        name: 'General',
        refDate: true,
        inputData: "\n                    3\t8\t16\t40\t43\t1\n                    1\t29\t33\t45\t47\t2\n                    14\t27\t39\t46\t48\t3\n                    5\t25\t34\t48\t50\t4\n                    15\t27\t33\t39\t50\t5\n                    ",
        layers: '5,5,6',
        lengthrow: 5,
        numberballs: 50,
        groupsConfig: '10,20,30,40,50'
      });
      localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
    } else {
      this.workplaces = workplaces;
    }
  },
  computed: {},
  methods: {
    getMatrixValueWithTableFormate: function getMatrixValueWithTableFormate(row, col) {
      var value = this.getMatrixValue(row, col);
      return value > 0 ? "<b style='color:red'>" + value + "</b>" : "<span style='color:lightgrey'>" + value + "</span>";
    },
    getMatrixValue: function getMatrixValue(row, col) {
      if (this.matrix[row] === undefined) {
        return 0;
      }

      if (this.matrix[row][col] === undefined) {
        return 0;
      }

      return this.matrix[row][col];
    },
    addWorkPlace: function addWorkPlace() {
      var workplaceName = prompt("Please enter a name For the Workplace:", "");

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
      this.diagram = "";
      this.output = "";
      this.selectedGroup = "";
      setTimeout(this.createGroups(), 5000);
    },
    saveWorkPlace: function saveWorkPlace() {
      var _this = this;

      var foundIndex = this.workplaces.findIndex(function (x) {
        return x.name == _this.selectedWorkplace.name;
      });
      this.workplaces[foundIndex] = this.selectedWorkplace;
      localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
    },
    renameWorkPlace: function renameWorkPlace() {
      var _this2 = this;

      var workplaceName = prompt("Please enter a name For the Workplace:", this.selectedWorkplace.name);

      if (workplaceName == null || workplaceName == "") {
        alert("the name can not be empty !");
      } else if (this.workplaces.find(function (o) {
        return o.name === workplaceName;
      })) {
        alert("Name already exist !");
      } else {
        var foundIndex = this.workplaces.findIndex(function (x) {
          return x.name == _this2.selectedWorkplace.name;
        });
        this.workplaces[foundIndex].name = workplaceName;
        localStorage.setItem('workplaces', JSON.stringify(this.workplaces));
      }
    },
    removeWorkPlace: function removeWorkPlace() {
      var _this3 = this;

      if (confirm("Are you sure you want to delete this workplace")) {
        txt = "You pressed OK!";

        if (this.workplaces.length === 1) {
          alert("You can not remove the last workplace !");
        } else {
          var filteredWorkplaces = this.workplaces.filter(function (x) {
            return x.name !== _this3.selectedWorkplace.name;
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
    trainnetwork: function trainnetwork() {
      //for (var i=0;i<1;i++){
      stats = this.net.train(this.tD);
      this.output = "Error:" + stats["error"] + " Iterations: " + stats['iterations'];
      this.output += "<br/>Trained.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";
      this.diagram = brain.utilities.toSVG(this.net);
      this.runthrough();
    },
    runthrough: function runthrough() {
      result = this.net.run(this.lastResult);
      ordlst = this.highestProb(result);
      numbersToPlay = ordlst.slice(0, 7);
      this.output += "From most likely to least likely: " + ordlst.join(', ') + "<br/>";
      this.output += "Numbers to play: <b>" + numbersToPlay.join(' ') + "</b><br/>";
      this.output += "Here are 10 sets ran in series:<br/>";
      nextResult = this.lastResult;
      balls = ordlst.length;
      numbers = numbersToPlay.length;

      for (var i = 0; i < 5; i++) {
        result = this.net.run(nextResult);
        ordlst = this.highestProb(result, print = 0);
        thisSet = ordlst.slice(0, numbers);
        this.output += "<b>" + thisSet.join(" ") + "</b><br/>";
        nextResult = this.tD_Ones(balls, thisSet);
      }
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
      this.selectedGroup = name;
      this.result_group = values.winning;
      this.result_group_winning = values.winning.join(" ");
      this.result_group_winningAndRef = values.winningAndRef;
      this.result_group_refs = values.refs;
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

      console.log('[matrix]', this.matrix);
    },
    createGroups: function createGroups() {
      var _this4 = this;

      this.saveWorkPlace(); //clear previous groups

      this.subgroups = {
        'All': {
          winning: [],
          winningAndRef: [],
          refs: []
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
      lengthrow = +this.selectedWorkplace.lengthrow;
      console.log('[lengthrow]', lengthrow);

      var _loop = function _loop() {
        //use last column as date ref column filter out the other numbers as winnings
        if (i === 0 || _this4.selectedWorkplace.refDate === false) {
          input = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);

          _this4.generateProportionMatrix(input);
        } else {
          input = inputs.slice(i * (lengthrow + 1), i * (lengthrow + 1) + lengthrow);

          _this4.generateProportionMatrix(input);
        } //input = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);


        if (_this4.selectedWorkplace.refDate === true) {
          inputWithRef = inputs.slice(i * (lengthrow + 1), i * (lengthrow + 1) + (lengthrow + 1));
          ref = inputs[i * lengthrow + (lengthrow + i)];
        } else {
          inputWithRef = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
          ref = i;
        } //get the ref column


        if (_this4.selectedWorkplace.refDate === true) {
          inputRef = inputs[i * lengthrow];
        }

        groupsConfig1 = _this4.selectedWorkplace.groupsConfig;
        groupsConfig = groupsConfig1.split(",");
        console.log("[groupsConfig]", groupsConfig);
        var subname = []; //for (var j=0;j<lengthrow;j++){

        for (j = 0; j < groupsConfig.length; j++) {
          subname.push(0);
        }

        input.forEach(function (element) {
          var triggered = false;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = groupsConfig.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                  index = _step2$value[0],
                  val = _step2$value[1];

              if (triggered === false) {
                console.log("[groupsConfig - index]", index);
                console.log("[groupsConfig - val]", val);
                console.log("[groupsConfig - element]", element);

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
        });
        subname = subname.join("-");

        if (_this4.subgroups[subname] === undefined) {
          _this4.subgroups[subname] = [];
          _this4.subgroups[subname]['name'] = '';
          _this4.subgroups[subname]['winning'] = [];
          _this4.subgroups[subname]['winningAndRef'] = [];
          _this4.subgroups[subname]['refs'] = [];
        }

        _this4.subgroups[subname]['name'] = subname;

        _this4.subgroups[subname]['winning'].push(input);

        _this4.subgroups[subname]['winningAndRef'].push(inputWithRef.join(" "));

        _this4.subgroups[subname]['refs'].push(ref);

        _this4.groupKeys.push(subname);

        _this4.subgroups.All.name = '';

        _this4.subgroups.All.winning.push(input);

        _this4.subgroups.All.winningAndRef.push(inputWithRef.join(" "));

        _this4.subgroups.All.refs.push(ref);
      };

      for (var i = 0; i < Math.floor(inputs.length / (lengthrow + (this.selectedWorkplace.refDate ? 1 : 0))); i++) {
        var groupsConfig1;
        var groupsConfig;
        var j;

        _loop();
      } //this.result_group_winning =this.groupKeys.join(" ");

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
  }
});