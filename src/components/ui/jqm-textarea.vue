<template>
    <textarea class="ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow"
        ref="textarea"
        v-bind:value="value"
        v-on:input="onInputHandler"
        v-on:focus="localFocus = true"
        v-on:blur="localFocus = false"
        v-bind:class="{ 'ui-mini': mini, 'ui-focus': localFocus }">
    </textarea>
</template>

<script>
    export default {
        props: ["value", "focus", "mini"],
        data() {
            return {
                localFocus: this.focus
            };
        },
        watch: {
            focus(newValue) {
                if (newValue) {
                    this.$refs.textarea.focus();
                }
            }
        },
        methods: {
            onInputHandler(event) {
                this.$emit('input', event.target.value);
                this.autoGrow(this.$refs.textarea);
            },
            autoGrow(el) {
                var borderHeight, compStyles = window.getComputedStyle(el);

                borderHeight = parseFloat(compStyles["border-top-width"]) + parseFloat(compStyles["border-bottom-width"]);
                el.style.height = "0px";
                el.style.height = el.scrollHeight + borderHeight + 15 + "px";
            }
        },
        mounted() {
            this.autoGrow(this.$refs.textarea);
        }
    }
</script>
