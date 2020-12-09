var app = new Vue({
    el: '#app',
    data: {
        refDate: true,
        message: 'Hello Vue!',
        net: 0,
        tD :0,
        lastDraw :0,
        lastResult :0,
        lengthrow :5,
        numberballs :50,
        layers :'5,5,6',

        result_group :"",
        result_group_winning : "",
        result_group_winningAndRef : "",
        result_group_refs : "",
        diagram : "",
        output : "",
        inputData : `
        3	8	16	40	43	1
        1	29	33	45	47	2
        14	27	39	46	48	3
        5	25	34	48	50	4
        15	27	33	39	50	5
        `,
        subgroups : {
            'All':{
                winning:[],
                winningAndRef:[],
                refs:[]
            }
        },
        selectedGroup:'',
        groupKeys : []
    },
    methods: {

        //https://stackoverflow.com/questions/39927452/recursively-print-all-permutations-of-a-string-javascript
        permut(string) {
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
        },
        clean(s){
            r = s.replace(/\D/g,' ');
            r = r.replace(/\s\s+/g, ' ');
            return r;
        },
        zpadlen(n,len){
            return ("00000"+n).slice(-len);
        },
        zpad(n){
            return ("0000"+n).slice(-4);
        },
        zpad2(n){
            return ("0000"+n).slice(-2);
        },
        zpad3(n){
            return ("0000"+n).slice(-3);
        },
        zpad4(n){
            return ("0000"+n).slice(-4);
        },
        sumstr(s){
            r = 0;
            for (i=0;i<s.length;i++){
                r += parseInt(s[i]);
            }
            return r;
        },
        rootstr(s){
            n = parseInt(s);
            while (n > 9){
                n = sumstr(n+"") + "";
                n = parseInt(n);
            }
            return n;
        },
        tablerow(row){
            r = "<tr>"
            for (i=0;i<row.length;i++){
                r += "<td align='center'>"+row[i]+"</td>"
            }
            r += "</tr>";
            return r;
        },
        addstr(s1,s2){
            r = "";
            for (i=0;i<s1.length;i++){
                r+= "" + ((parseInt(s1[i]) + parseInt(s2[i]))%10);
            }
            return r;
        },
        subarr(a1,a2){
            r = [];
            for (i=0;i<a1.length;i++){
                r.push(parseInt(a1[i]) - parseInt(a2[i]));
            }
            return r;
        },
        addarr(a1, a2){
            r = [];
            for (i=0;i<a1.length;i++){
                r.push(parseInt(a1[i]) + parseInt(a2[i]));
            }
            return r; 
        },
        bracket_if_match(str,n){
            r = [];
            for (var i=0;i<str.length;i++){
                if (parseInt(str[i]) == parseInt(n)){
                r.push("(" + str[i] + ")");
                }else{
                r.push(str[i]);
                }
            }
            return r;
        },
        mirror(n){
            n = "" + n;
            r = "";
            for (var i=0;i<n.length;i++){
                r += ((parseInt(n[i])+5)%10) + "";
            }
            return r;
        },
        mirrorarr(ar){
            var r = [];
            for (var i=0;i<ar.length;i++){
                r.push(mirror(ar[i]));
            }
            return r;
        },
        intarr(ar){
            var re = [];
            for (var i=0;i<ar.length;i++){
                re.push(parseInt(ar[i]));
            }
            return re;
        },
        lotmat(ar){
            re = 0;
            for (i=0;i<ar.length;i++){
                re += parseInt(ar[i]);
            }
            re = re % 10;
            return re;
        },



        createnetwork(){
            hidlayers = eval("["+this.layers+"]");
            this.net = new brain.NeuralNetwork({ hiddenLayers: hidlayers});
            outputt = "Neural Net created with Hidden Layers Shape ["+ hidlayers.join(",") +"]<br/>";
            this.output = outputt;

        },
        reverseInputLines(){
            input = this.inputData;
            input = input.split("\n");
            input = input.reverse();
            input = input.join("\n");
            this.inputData = input;
        },  

        highestProb(result,print=1){
            orderlst = [];
            for (var i=0;i<result.length;i++){
                orderlst.push([i+1,result[i]]);
            }
            orderlst = orderlst.sort(function(a,b){return b[1]-a[1]});
            lst = [];
            if (print==1){
                this.output += "Highest probability is: " + orderlst[0][1] + "<br/>";
                this.output += "Lowest probability is: " + orderlst[orderlst.length-1][1] + "<br/>";
            }
            for (var i=0;i<orderlst.length;i++){
                lst.push(orderlst[i][0]);
            }
            return lst;
        },
        trainnetwork(){
            //for (var i=0;i<1;i++){
            stats = this.net.train(this.tD);
            this.output = "Error:" + stats["error"] + " Iterations: " + stats['iterations'];
            this.output += "<br/>Trained.<br/>Run with last Draw result: " + this.lastDraw.join(", ") +"<br/>";

            this.diagram = brain.utilities.toSVG(this.net)

            this.runthrough();
        },

        runthrough(){
            result = this.net.run(this.lastResult);
            ordlst = this.highestProb(result);
            numbersToPlay = ordlst.slice(0,7);
            this.output += "From most likely to least likely: " + ordlst.join(', ') + "<br/>";
            this.output += "Numbers to play: <b>" + numbersToPlay.join(' ') + "</b><br/>";
            this.output += "Here are 10 sets ran in series:<br/>";
            nextResult = this.lastResult;
            balls = ordlst.length;
            numbers = numbersToPlay.length;
            for (var i=0;i<5;i++){
                result = this.net.run(nextResult);
                ordlst = this.highestProb(result,print=0);
                thisSet = ordlst.slice(0,numbers);
                this.output += "<b>"+thisSet.join(" ")+"</b><br/>";
                nextResult = this.tD_Ones(balls,thisSet);
            }

        },
        trainnetwork100(){
            for (var i=0;i<100;i++){
                this.net.train(this.tD);

            }
            this.output = "<br/>Trained 100x.<br/>Run with last Draw result: " + this.lastDraw.join(", ") +"<br/>";
            this.runthrough();
        },
        trainnetwork1000(){
            for (var i=0;i<1000;i++){
                this.net.train(this.tD);

            }
            this.output = "<br/>Trained 1000x.<br/>Run with last Draw result: " + this.lastDraw.join(", ") +"<br/>";
            this.runthrough();
        },
        readtrainingdata(){
            this.run();
        },
        tD_Ones(size,row){
            var res = [];
            for (var i=0;i<size;i++){
                res.push(0);
            }
            for (var i=0;i<row.length;i++){
                curindex = parseInt(row[i]) - 1;
                res[curindex] = 1;
            }
            return res;
        },

        changeResultGroup(name, values){

            this.selectedGroup = name;

            this.result_group = values.winning;

            this.result_group_winning = values.winning.join(" ");
            this.result_group_winningAndRef = values.winningAndRef;
            this.result_group_refs = values.refs;

            console.log('winning',this.result_group_winning)
        },

        createGroups(){

            //clear previous groups
            this.subgroups = {
                'All':{
                    winning:[],
                    winningAndRef:[],
                    refs:[]
                }
            };

            // put them in groups of 6 for each item
            //create rows here
            check = this.inputData;
            check = this.clean(check);
            checks = check.split(" ");
            var filtered = checks.filter(function (el) {//filter out empty
                return el != "";
            });
            inputs = filtered;
            lengthrow = +this.lengthrow;

            for (var i=0;i<(Math.floor(inputs.length/(lengthrow+(this.refDate?1:0) )));i++){

                //use last column as date ref column filter out the other numbers as winnings
                if(i === 0 || this.refDate === false){
                    input = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);
                }else{
                    input = inputs.slice(i*(lengthrow+1),i*(lengthrow+1)+(lengthrow));
                }
                console.log('input',input)
                //input = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);

                if(this.refDate === true){
                    inputWithRef = inputs.slice(i*(lengthrow+1),i*(lengthrow+1)+(lengthrow+1));
                    ref = inputs[i*lengthrow+(lengthrow+i)];

                }else{
                    inputWithRef = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);
                    ref = i;
                }

                //get the ref column
                if(this.refDate === true){
                    inputRef = inputs[i*lengthrow];
                }

                let subname = [0,0,0,0,0]
                input.forEach(element => {

                    if(element < 10){50
                        subname[0] += 1;
                    }else if(element < 20){
                        subname[1] += 1;
                    }else if(element < 30){
                        subname[2] += 1;
                    }else if(element < 40){
                        subname[3] += 1;
                    }else if(element < 50){
                        subname[4] += 1;
                    }

                });


                subname = subname.join("-");
                if(this.subgroups[subname] === undefined){
                    this.subgroups[subname] = [];
                    this.subgroups[subname]['winning'] = [];
                    this.subgroups[subname]['winningAndRef'] = [];
                    this.subgroups[subname]['refs'] = [];
                }
                this.subgroups[subname]['winning'].push(input);
                this.subgroups[subname]['winningAndRef'].push(inputWithRef.join(" "));
                this.subgroups[subname]['refs'].push(ref);
                this.groupKeys.push(subname);

                this.subgroups.All.winning.push(input);
                this.subgroups.All.winningAndRef.push(inputWithRef.join(" "));
                this.subgroups.All.refs.push(ref);
            }

            //this.result_group_winning =this.groupKeys.join(" ");
            console.log(this.subgroups.All);
        },
        run(){
            outputt = "";
            //check these numbers in 'check' element
            //lastdraw =  .getElementById('draw').value;
            check = this.result_group_winning;
            check = this.clean(check);
            checks = check.split(" ");
            var filtered = checks.filter(function (el) {//filter out empty
                return el != "";
            });
            checks = filtered;


            inputs = checks;

            //get row length
            lengthrow = +this.lengthrow;
            

            //len = inputs[0].length; //Pick-3/Pick-4 indicator based on len.
            len = lengthrow;

            // put them in groups of 6 for each item
            //create rows here
            finputs = [];
            for (var i=0;i<(Math.floor(inputs.length/lengthrow));i++){

                //use last column as date ref column filter out the other numbers as winnings
                input = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);
                finputs.push(input);

            }
            inputs = finputs;

            //inputs = inputs.reverse(); //reverse so that it's from oldest to newest
            balls = this.numberballs;

            this.tD = [];
            for (var i=0;i<inputs.length-1;i++){
                tDin = this.tD_Ones(balls,inputs[i].slice(0,len));
                tDout = this.tD_Ones(balls,inputs[i+1].slice(0,len));
                this.tD.push({input:tDin,output:tDout});
            }
            this.lastDraw = inputs[inputs.length-1];
            console.log('[lastDraw]',inputs);
            this.lastResult = this.tD_Ones(balls,this.lastDraw.slice(0,len));
            outputt+="Read training data!";
            this.output = outputt;
        }



    }
})


