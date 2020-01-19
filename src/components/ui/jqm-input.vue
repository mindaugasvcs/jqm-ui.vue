<template>
    <div class="ui-body-inherit ui-corner-all ui-shadow-inset" v-bind:class="classArray">
        <input ref="input"
            v-bind:type="localType"
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
            v-on:focus="onFocus"
            v-on:blur="onBlur"
            v-bind:maxlength="maxlength"
            v-bind:placeholder="placeholder"
            v-bind:readonly="readonly">
        <a v-if="type === 'search'"
            tabindex="-1"
            v-on:click="clearText"
            v-bind:class="{'ui-input-clear-hidden': !value}"
            class="ui-input-clear ui-btn ui-btn-icon-notext ui-icon-delete ui-corner-all"
            title="Clear text"></a>
        <a v-else-if="type === 'password'"
            tabindex="-1"
            v-on:click="toggleShowText"
            v-bind:class="{'ui-input-clear-hidden': !value, 'ui-icon-eye': localType==='text', 'ui-icon-no-eye': localType!=='text'}"
            class="ui-input-clear ui-btn ui-btn-icon-notext ui-corner-all"
            v-bind:title="localType === 'text' ? 'Hide' : 'Show'"></a>
    </div>
</template>

<script>
    export default {
        props: ["type", "value", "maxlength", "placeholder", "readonly", "mini"],
        data() {
            return {
                localType: this.type === "search" ? "text" : this.type,
                focused: false
            };
        },
        computed: {
            hasButton() {
                return this.type === "search" || this.type === "password";
            },
            classArray() {
                return [
                    this.type === "search" ? 'ui-input-search' : 'ui-input-text',
                    {
                        'ui-input-has-clear': this.hasButton,
                        'ui-mini': this.mini,
                        'ui-focus': this.focused
                    }
                ];
            }
        },
        methods: {
            focus() {
                this.$refs.input.focus();
            },
            clearText(event) {
                this.focus();
                this.$emit('input', '');
            },
            toggleShowText() {
                this.focus();
                if (this.localType === "password") {
                    this.localType = "text";
                } else {
                    this.localType = "password";
                }
            },
            onFocus() {
                this.focused = true;
                this.$emit('focus', event);
            },
            onBlur() {
                this.focused = false;
                this.$emit('blur', event);
            }
        }
    }
</script>
