<template>
    <div class="overlay">
        <div class="overlay-container">
            <div class="overlay-content">
                <h3>Orange Face</h3>
                <div>


                    <div :class="'square ' + (flippy?'spinner':'')" @click="flip()">

                        <div class="eyes">
                            <div class="eye"></div>
                            <div class="eye two"></div>
                        </div>
                        <div class="mouth">
                            <div class="lezu"></div>
                        </div>

                    </div>
                    <div v-if="lucky!==null">
                        <p>Your Luck number is : {{lucky}}</p>
                        <p>{{(color===1?'Orange':'Black')}}</p>
                    </div>



                </div>
                <div>
                    <button class="btn btn-primary" @click="close()">Close</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {
                flippy:false,
                lucky:null,
                color:''
            }
        },
        methods: {
            flip() {
                if(this.flippy === false){
                    this.lucky = null;
                    let time = Math.floor(Math.random() * 11);      // returns a random integer from 0 to 10
                    let luckyInt = Math.floor(Math.random() * 100);      // returns a random integer from 0 to 99
                    let colorInt = Math.floor(Math.random() * 2);      // returns a random integer from 0 to 1

                    this.flippy = true;
                    setTimeout(()=>{ 

                        this.flippy = false;
                        this.lucky = luckyInt
                        this.color = colorInt

                    }, (time*1000));//3 seconds

                }
            },
            close() {
                this.$emit('closeface', false);
            }
        }
    }
</script>

<style scoped>
    .overlay-content {
        display: inline-block;
    }

    .overlay {
        background-color: #000000a6;
        position: fixed;
        height: 100%;
        width: 100%;
    }

    .overlay-container {
        text-align: center;
        background: #F44725;
        color: white;
        margin: 0;
        position: absolute;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        padding: 15px;
        width: 100%;
    }
    .square {
        position: relative;
        width: 60px;
        height: 80px;
        background-color: white;
        margin: 100px auto;
        -webkit-animation-name: move; /* Chrome, Safari, Opera */
        -webkit-animation-duration: 5s; /* Chrome, Safari, Opera */
        animation-name: move;
        animation-duration: 5s;
        animation-iteration-count: infinite;
    }

    .spinner {
        -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
        animation: sk-rotateplane 1.2s infinite ease-in-out;
    }
.eyes{
  position: absolute;
  top: 20px;
  width: 40px;
  height: 10px;
  left: 12px;
  overflow: hidden;
  -webkit-animation-name: eyes; /* Chrome, Safari, Opera */
  -webkit-animation-duration: 1s; /* Chrome, Safari, Opera */
  animation-name: eyes;
  animation-duration: 3s;
  animtaion-delay: 6s;
  animation-iteration-count: infinite;
}
.eye{
    position: absolute;
    left: 0px;
    width: 10px;
    border-radius: 10px;
    height: 100%;
    background: #f44725;
}
.eye.two{
  left: initial;
  right: 0;
}
.mouth{
  position: absolute;
  width: 40px;
  height: 25px;
  background: #c0392b;
  left: 12px;
  top: 45px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: hidden;
  -webkit-animation-name: laught; /* Chrome, Safari, Opera */
  -webkit-animation-duration: 2s; /* Chrome, Safari, Opera */
  animation-name: laught;
  animation-duration: 2s;
  animation-iteration-count: 1;
}
.lezu{
  position: absolute;
  bottom: -30px;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: #e74c3c;
}

@-webkit-keyframes laught {
    0%   {height: 0px;}
    100% {height: 25px;}
}
@-webkit-keyframes eyes {
    0%   {height: 0px;}
    10%  {height: 10px;}
    20%  {height: 10px;}
    30%  {height: 10px;}
    40%  {height: 10px;}
    50%  {height: 10px;}
    60%  {height: 10px;}
    70%  {height: 10px;}
    80%  {height: 10px;}
    90%  {height: 10px;}
    100% {height: 0px;}
}
@-webkit-keyframes move {
  0% { -webkit-transform: translateY(0); }
  50% { -webkit-transform: translateY(-20px); }
  100% { -webkit-transform: translateY(0); }
}
</style>