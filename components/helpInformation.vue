<template>
    <div class="overflow-container" style="padding:20px;">

        <br>
        <div style="width:400px;font-family: 'Monoton', cursive;">
            <h2>Super</h2>
            <h2>Orange</h2>
            <h2>App</h2>
        </div>
        <br>
        <h2>
            How to use :
        </h2>
        <p>
            First select a Tab on the left, The General tab is loaded with sample data<br> Load the network with
            previous winnings to generate a model in the Large Text area<br> 1. First, click on [Create Groups]
            button.<br> 2. Then, Select
            a group you want to use<br> 3. Then, click on [Create Neural Network] button.<br> 4. Then, click [Read
            Training Data].<br> 5. Then, click [Run] button as many times as you like to see trained network and results
            of run.

        </p>
        <br>
        <br>
        <h3>Additional options</h3>
        <p>
            Reference date - If selected it will take additional column form the winnings to identify where the winning
            is in the list, if not selected the computer will set this automatically.<br><br> Number of columns in a row
            - This
            input tells the app how many numbers make a row of winning numbers. <br><br> Number on balls go to - How
            High do the numbers on the balls count up to.<br><br> Configure your groups (10,20,30,40,50) - Grouping up
            winning numbers
            into sets, this input takes a rule for how you want the sets to be created, for example if you insert
            '10,50' and a winning ticket is ' 3 19 50 49 24' then the group will be '1-4' because there is only 1 number
            less than or
            equal to 10 and the remain 4 numbers are greater than or equal to 50<br><br> Hidden Layers first learning
            Shape - Brain.js neural network model configuration, by default you can set this to 70, if you want to
            adjust the apps
            predictions you can insert more complex models ex '5,5,2,9'.<br><br> Predict next group - if true, this will
            perform a sequence prediction on the groups based on each winning row and when the group was created to
            predict the
            next posible group.<br><br>
        </p>
    </div>
</template>

<script>
    module.exports = {
        data: function () {
            return {
            }
        }
    }
</script>
