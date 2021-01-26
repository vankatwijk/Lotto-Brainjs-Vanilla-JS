<template>
    <div class="overlay" v-show="show">
        <div class="overlay-container">
            <div class="overlay-content">
                <h3>Select columns</h3>
                <div>

                    <div class="form-group row">
                        <div class="col-8">
                            <label for="totalcolumns">How many columns do you have :</label>
                        </div>
                        <div class="col">
                            <input type="number" id="totalcolumns" v-model="formData.totalColumns">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-8">
                            <label for="selectfrom">From which column do you want to select :</label>
                        </div>
                        <div class="col">
                            <input type="number" id="selectfrom" v-model="formData.selectFrom">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-8">
                            <label for="selectto">To which column do you want to select :</label>
                        </div>
                        <div class="col">
                            <input type="number" id="selectto" v-model="formData.selectTo">
                        </div>
                    </div>
                </div>
                <div>
                    <button class="btn btn-primary" @click="cancel()">Cancel</button>
                    <button class="btn btn-primary" @click="done()">Done</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    module.exports = {
        props: {
            show: {
                type: Boolean,
                required: true
            },
            inputdata: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                formData: {}
            }
        },
        methods: {
            cancel() {
                this.$emit('showm', false);
            },
            clean(s) {
                let r = s.replace(/\D/g, ' ');
                r = r.replace(/\s\s+/g, ' ');
                return r;
            },
            subselect(array, from, to) {
                return array.slice(from, to + 1);
            },
            done() {
                this.$emit('showm', false);
                if (this.formData.totalColumns > 0 && this.formData.selectFrom > 0 && this.formData.selectTo > 0) {

                    let totalColumns = +this.formData.totalColumns - 1;
                    let selectFrom = +this.formData.selectFrom - 1;
                    let selectTo = +this.formData.selectTo - 1;

                    let cleanData = this.clean(this.inputdata);
                    let tempdataArr = cleanData.split(" ");
                    let filtered = tempdataArr.filter(function (el) { //filter out empty
                        return el != "";
                    });
                    tempdataArr = filtered;
                    let newString = '';

                    for (let i = 0; i <= tempdataArr.length; i = i + (totalColumns + 1)) {
                        console.log('length', tempdataArr.length);
                        console.log('test', tempdataArr[i]);

                        console.log('from :', i);
                        console.log('to :', i + (totalColumns));

                        newString += (this.subselect(tempdataArr.slice(i, (i + totalColumns + 1)), selectFrom,
                            selectTo).join(" ")) + "\n";
                        console.log('string :', newString);
                    }


                    this.$emit('done', newString);

                } else {
                    alert('all fields are required')
                }

            }
        }
    }
</script>

<style scoped>
    .overlay-content {
        display:inline-block;
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
</style>