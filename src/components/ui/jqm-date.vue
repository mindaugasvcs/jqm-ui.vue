<template>
    <div>
        <jqm-input type="text" v-bind:ref="name" v-bind:name="name" v-bind:value="value" v-on:input="$emit('input', $event)" v-bind:class="classes" v-on:focus="onFocus" v-on:blur="onBlur" maxlength="10"></jqm-input>
        <jqm-datepicker v-if="inline" v-bind:value="value" v-on:input="$emit('input', $event)" v-bind:language="language"></jqm-datepicker>
    </div>
</template>

<script>
    import JqmDatePicker from "./jqm-datepicker.vue";

    export default {
        components: {
            "jqm-datepicker": JqmDatePicker
        },
        props: ["name", "value", "inline", "classes", "language"],
        methods: {
            onFocus() {
                if (!this.inline) {
                    this.$root.$emit("show-popup", this.name);
                }
            },
            onBlur(event) {
                if (!this.inline) {
                    if (!event.relatedTarget || !this.popupContainer.contains(event.relatedTarget)) {
                        this.$root.$emit("hide-popup", this.name);
                    }
                }
            },
            initPopup() {
                if (!this.inline) {
                    this.$root.$emit("create-popup", {
                        component: "jqm-datepicker-popup",
                        name: this.name,
                        value: this.value,
                        language: this.language,
                        origin: this.$refs[this.name].$refs.input,
                        base: this
                    });
                }
            }
        },
        watch: {
            language() {
                this.initPopup();
            }
        },
        mounted() {
            this.initPopup();
        }
    }
</script>

<style>
.ui-datepicker-header {
    position: relative;
    width: 18em;
    border-bottom: 0;
}
.ui-datepicker-header .ui-btn-inline {
    margin: 0;
}
.ui-datepicker-prev,
.ui-datepicker-next {
    padding: 1px 0 1px 2px;
    position: absolute;
    top: 0.4em;
}
.ui-datepicker-prev {
    left: 0.4em;
}
.ui-datepicker-next {
    right: 0.4em;
}
.ui-datepicker-title {
    text-align: center;
}
.ui-datepicker-calendar {
    width: 100%;
    border-collapse: collapse;
}
.ui-datepicker-calendar th {
    padding-top: .4em;
    padding-bottom: .4em;
    border-width: 1px;
    border-style: solid;
}
.ui-datepicker-calendar th span {
    opacity: .7;
}
.ui-datepicker-calendar td {
    padding: 0;
    border-width: 1px;
    border-style: solid;
}
.ui-datepicker-calendar td a {
    padding: .6em .5em;
    margin: 0;
    border-width: 0;
}
</style>