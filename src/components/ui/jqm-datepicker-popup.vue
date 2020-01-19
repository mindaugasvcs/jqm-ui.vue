<template>
    <jqm-popup ref="popup" v-bind:show="show" v-bind:origin="origin">
        <jqm-datepicker v-bind:value="value" v-on:input="base.$emit('input', $event)" v-on:complete="hide" v-bind:language="language"></jqm-datepicker>
    </jqm-popup>
</template>

<script>
    import JqmPopup from "./jqm-popup.vue";
    import JqmDatePicker from "./jqm-datepicker.vue";

    export default {
        components: {
            "jqm-popup": JqmPopup,
            "jqm-datepicker": JqmDatePicker
        },
        props: ["value", "show", "origin", "base", "language"],
        methods: {
            hide() {
                this.$emit("update:show", false);
            }
        },
        mounted() {
            this.base["popupContainer"] = this.$refs.popup.$refs.popupContainer;
        }
    }
</script>
