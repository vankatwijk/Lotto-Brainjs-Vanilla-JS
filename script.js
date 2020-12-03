
//https://stackoverflow.com/questions/39927452/recursively-print-all-permutations-of-a-string-javascript
function permut(string) {
    if (string.length < 2) return string; // This is our break condition

    var permutations = []; // This array will hold our permutations

    for (var i=0; i<string.length; i++) {
        var char = string[i];

        // Cause we don't want any duplicates:
        if (string.indexOf(char) != i) // if char was used already
            continue;           // skip it this time

        var remainingString = string.slice(0,i) + string.slice(i+1,string.length); //Note: you can concat Strings via '+' in JS

        for (var subPermutation of permut(remainingString))
            permutations.push(char + subPermutation)

    }
    return permutations;
}

function clean(s){
    r = s.replace(/\D/g,' ');
    r = r.replace(/\s\s+/g, ' ');
    return r;
}
function zpadlen(n,len){
    return ("00000"+n).slice(-len);
}
function zpad(n){
    return ("0000"+n).slice(-4);
}
function zpad2(n){
    return ("0000"+n).slice(-2);
}
function zpad3(n){
    return ("0000"+n).slice(-3);
}
function zpad4(n){
    return ("0000"+n).slice(-4);
}
function sumstr(s){
    r = 0;
    for (i=0;i<s.length;i++){
        r += parseInt(s[i]);
    }
    return r;
}
function rootstr(s){
    n = parseInt(s);
    while (n > 9){
        n = sumstr(n+"") + "";
        n = parseInt(n);
    }
    return n;
}
function tablerow(row){
    r = "<tr>"
    for (i=0;i<row.length;i++){
        r += "<td align='center'>"+row[i]+"</td>"
    }
    r += "</tr>";
    return r;
}
function addstr(s1,s2){
    r = "";
    for (i=0;i<s1.length;i++){
        r+= "" + ((parseInt(s1[i]) + parseInt(s2[i]))%10);
    }
    return r;
}
function subarr(a1,a2){
    r = [];
    for (i=0;i<a1.length;i++){
        r.push(parseInt(a1[i]) - parseInt(a2[i]));
    }
    return r;
}
function addarr(a1, a2){
    r = [];
    for (i=0;i<a1.length;i++){
        r.push(parseInt(a1[i]) + parseInt(a2[i]));
    }
    return r; 
}
function bracket_if_match(str,n){
    r = [];
    for (var i=0;i<str.length;i++){
        if (parseInt(str[i]) == parseInt(n)){
        r.push("(" + str[i] + ")");
        }else{
        r.push(str[i]);
        }
    }
    return r;
}

function mirror(n){
    n = "" + n;
    r = "";
    for (var i=0;i<n.length;i++){
        r += ((parseInt(n[i])+5)%10) + "";
    }
    return r;
}
function mirrorarr(ar){
    var r = [];
    for (var i=0;i<ar.length;i++){
        r.push(mirror(ar[i]));
    }
    return r;
}

function intarr(ar){
    var re = [];
    for (var i=0;i<ar.length;i++){
        re.push(parseInt(ar[i]));
    }
    return re;
}
function lotmat(ar){
    re = 0;
    for (i=0;i<ar.length;i++){
        re += parseInt(ar[i]);
    }
    re = re % 10;
    return re;
}


var net = 0;
var tD = 0;
var lastDraw = 0;
var lastResult = 0;


function createnetwork(){
    hidlayers = eval("["+document.getElementById("layers").value+"]");
    net = new brain.NeuralNetwork({ hiddenLayers: hidlayers});
    outputt = "Neural Net created with Hidden Layers Shape ["+ hidlayers.join(",") +"]<br/>";
    document.getElementById('output').innerHTML = outputt;

}
function reverseInputLines(){
    input = document.getElementById('input').value;
    input = input.split("\n");
    input = input.reverse();
    input = input.join("\n");
    document.getElementById('input').value = input;
}  

function highestProb(result,print=1){
    orderlst = [];
    for (var i=0;i<result.length;i++){
        orderlst.push([i+1,result[i]]);
    }
    orderlst = orderlst.sort(function(a,b){return b[1]-a[1]});
    lst = [];
    if (print==1){
        document.getElementById('output').innerHTML += "Highest probability is: " + orderlst[0][1] + "<br/>";
        document.getElementById('output').innerHTML += "Lowest probability is: " + orderlst[orderlst.length-1][1] + "<br/>";
    }
    for (var i=0;i<orderlst.length;i++){
        lst.push(orderlst[i][0]);
    }
    return lst;
}
function trainnetwork(){
    //for (var i=0;i<1;i++){
    stats = net.train(tD);
    document.getElementById('output').innerHTML = "Error:" + stats["error"] + " Iterations: " + stats['iterations'];
    document.getElementById('output').innerHTML += "<br/>Trained.<br/>Run with last Draw result: " + lastDraw.join(", ") +"<br/>";
    const diagram = document.getElementById('networkd')
    diagram.innerHTML = brain.utilities.toSVG(net)
    runthrough();
}

function runthrough(){
    result = net.run(lastResult);
    ordlst = highestProb(result);
    numbersToPlay = ordlst.slice(0,7);
    document.getElementById('output').innerHTML += "From most likely to least likely: " + ordlst.join(', ') + "<br/>";
    document.getElementById('output').innerHTML += "Numbers to play: <b>" + numbersToPlay.join(' ') + "</b><br/>";
    document.getElementById('output').innerHTML += "Here are 10 sets ran in series:<br/>";
    nextResult = lastResult;
    balls = ordlst.length;
    numbers = numbersToPlay.length;
    for (var i=0;i<5;i++){
        result = net.run(nextResult);
        ordlst = highestProb(result,print=0);
        thisSet = ordlst.slice(0,numbers);
        document.getElementById('output').innerHTML += "<b>"+thisSet.join(" ")+"</b><br/>";
        nextResult = tD_Ones(balls,thisSet);
    }

}
function trainnetwork100(){
    for (var i=0;i<100;i++){
        net.train(tD);

    }
    document.getElementById('output').innerHTML = "<br/>Trained 100x.<br/>Run with last Draw result: " + lastDraw.join(", ") +"<br/>";
    runthrough();
}

function trainnetwork1000(){
    for (var i=0;i<1000;i++){
        net.train(tD);

    }
    document.getElementById('output').innerHTML = "<br/>Trained 1000x.<br/>Run with last Draw result: " + lastDraw.join(", ") +"<br/>";
    runthrough();
}

function readtrainingdata(){
    run();
}


function tD_Ones(size,row){
    var res = [];
    for (var i=0;i<size;i++){
        res.push(0);
    }
    for (var i=0;i<row.length;i++){
        curindex = parseInt(row[i]) - 1;
        res[curindex] = 1;
    }
    return res;
}

function run(){
    outputt = "";
    //check these numbers in 'check' element
    //lastdraw =  document.getElementById('draw').value;
    check = document.getElementById('input').value;
    check = clean(check);
    checks = check.split(" ");
    var filtered = checks.filter(function (el) {//filter out empty
        return el != "";
    });
    checks = filtered;


    inputs = checks;
    //len = inputs[0].length; //Pick-3/Pick-4 indicator based on len.
    len = 7;

    // put them in groups of 6 for each item
    finputs = [];
    for (var i=0;i<(Math.floor(inputs.length/8));i++){
        input = inputs.slice(i*8,i*8+8);
        finputs.push(input);
    }
    inputs = finputs;

    inputs = inputs.reverse(); //reverse so that it's from oldest to newest
    balls = 50;

    tD = [];
    for (var i=0;i<inputs.length-1;i++){
        tDin = tD_Ones(balls,inputs[i].slice(0,len));
        tDout = tD_Ones(balls,inputs[i+1].slice(0,len));
        tD.push({input:tDin,output:tDout});
    }
    lastDraw = inputs[inputs.length-1];
    lastResult = tD_Ones(balls,lastDraw.slice(0,len));
    outputt+="Read training data!";
    document.getElementById('output').innerHTML = outputt;
}