<template>
    <div>
        <h1>The Home Page</h1>
        <hr>
        <jqm-slider v-model.number="sliderValue" v-bind:highlight="true" v-bind:tooltip="true"></jqm-slider>
        <jqm-rangeslider v-model="rangeSliderValue" v-bind:highlight="true" v-bind:tooltip="true"></jqm-rangeslider>
        <jqm-checkbox id="selection-a" name="agree" value="yes" v-model="agreeToTerms">I agree!</jqm-checkbox>
        <jqm-radiobox id="selection-b" name="education" value="degree" v-model="education">Degree</jqm-radiobox>
        <jqm-radiobox id="selection-c" name="education" value="doctor" v-model="education">Doctor</jqm-radiobox>
        <jqm-input type="password" v-model="inputValue"></jqm-input>
        <jqm-textarea v-model="textareaValue"></jqm-textarea>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                sliderValue: 50,
                rangeSliderValue: [50, 75],
                agreeToTerms: ["yes"],
                education: "doctor",
                inputValue: "",
                textareaValue: "textareaValue"
            }
        }
    }
</script>
