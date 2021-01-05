const Access = {
    template: `
    <div class="wrap">
    <div class="cat">
      <div class="eyes">
        <div class="eye"></div>
        <div class="eye two"></div>
      </div>
      <div class="mouth">
        <div class="lezu"></div>
      </div>
      <div class="time">...</div>
    </div>
    <div class="shadow"></div>
    </div>

    <style>
    *{
        -webkit-user-select: none;
        cursor: default;
      }
      body{
        background: #34495e;
      }
      .wrap{
         position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 100px;
        height: 300px;
      }
      .cat{
        position: relative;
        width: 100px;
        height: 120px;
        background: #2c3e50;
        border-top-right-radius: 10px;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 50px;
        border-bottom-right-radius: 50px;
        -webkit-animation-name: move; /* Chrome, Safari, Opera */
        -webkit-animation-duration: 5s; /* Chrome, Safari, Opera */
        animation-name: move;
        animation-duration: 5s;
        animation-iteration-count: infinite;
      }
      .time{
        position: absolute;
        top: 0;
        left: 120px;
        font-family: 'Segoe UI';
        font-weight: 300;
        color: whitesmoke;
        font-size: 40px;
      }
      .time b{
        font-weight: normal;
        font-size: 18px;
        padding-left: 10px;
      }
      .eyes{
        position: absolute;
        top: 20px;
        width: 50px;
        height: 10px;
        left: 25px;
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
        left: 0;
        width: 10px;
        border-radius: 10px;
        height: 100%;
        background: whitesmoke;
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
        left: 30px;
        top: 50px;
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
      .shadow{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 100px;
        height: 20px;
        border-radius: 100%;
        background: rgba(0,0,0,.2);
        -webkit-filter: blur(2px);
        -webkit-animation-name: shadow; /* Chrome, Safari, Opera */
        -webkit-animation-duration: 5s; /* Chrome, Safari, Opera */
        animation-name: shadow;
        animation-duration: 5s;
        animation-iteration-count: infinite;
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
      @-webkit-keyframes shadow{
        0% { -webkit-filter: blur(5px);}
        50% { -webkit-filter: blur(15px);}
        100% {-webkit-filter: blur(5px);}
      }
    </style>
    `,
  
    data() {
      return {
      };
    },
    computed: {
    },
    mounted() {
    },
    methods: {
 
    },
  };