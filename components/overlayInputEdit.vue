<template>
  <div class="overlay" v-show="show">
    <div class="overlay-container">
    <div>
        <h3>Select columns</h3>
        <div>
        
        </div>
        <div>
            <button class="btn btn-primary" @click="cancel()" >Cancel</button>
            <button class="btn btn-primary" @click="done()" >Done</button>
        </div>
        </div>
    
    </div>
  </div>
</template>

<script>
    module.exports = {
        props:{
            show: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                formData:{}
            }
        },
        methods: {
            cancel(){
                this.$emit('showm',false);
            },
            done(){
                this.$emit('done',this.formData);

            }
        }
    }
</script>

<style scoped>
.overlay {
    background-color: #000000a6;
    position: fixed;
    height: 100%;
    width: 100%;
}

.overlay-container{
    background: #F44725;
    color:white;
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    padding: 15px;
    width: 100%;
}
</style>