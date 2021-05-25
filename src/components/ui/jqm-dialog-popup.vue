<template>
    <jqm-popup v-bind:show="show" positionTo="window" transition="pop" v-bind:dismissible="false">
        <div class="ui-popup ui-body-inherit ui-overlay-shadow ui-corner-all" style="min-width: 240px; max-width: 400px;">
            <div v-if="title" class="ui-header ui-bar-inherit">
                <h1 class="ui-title" style="margin: 0px;">{{ title }}</h1>
            </div>
            <div class="ui-content">
                <h3>{{ content }}</h3>
                <p v-if="description">{{ description }}</p>
                <jqm-input v-if="inputType" v-bind:type="inputType" ref="input" v-model="text" v-bind:maxlength="maxlength"></jqm-input>
                <div style="text-align: center;">
                    <button ref="buttons" type="button" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-iherit" tabindex="0"
                        v-for="button in buttons"
                        v-on:click="hide(); button.action(text);">{{ button.text }}</button>
                </div>
            </div>
        </div>
    </jqm-popup>
</template>

<script>
    import JqmPopup from "./jqm-popup.vue";
    import JqmInput from "./jqm-input.vue";

    export default {
        components: {
            "jqm-popup": JqmPopup,
            "jqm-input": JqmInput
        },
        props: ["show", "title", "content", "description", "buttons", "inputType", "maxlength"],
        data() {
            return {
                text: ''
            };
        },
        updated() {
            if (this.show) {
                if (this.inputType) {
                    this.$refs.input.focus();
                } else {
                    this.$refs.buttons[0].focus();
                }
            }
        },
        methods: {
            hide() {
                this.$emit("update:show", false);
            }
        }
    }
</script>
