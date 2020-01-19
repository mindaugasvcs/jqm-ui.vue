<template>
    <jqm-popup v-bind:show="show" positionTo="window" transition="pop" v-bind:dismissible="false">
        <div class="ui-popup ui-body-b ui-overlay-shadow ui-corner-all" style="max-width: 400px;">
            <div v-if="title" class="ui-header ui-bar-inherit">
                <h1 class="ui-title">{{ title }}</h1>
            </div>
            <div class="ui-content">
                <h3>{{ content }}</h3>
                <p v-if="description">{{ description }}</p>
                <button ref="buttons" type="button" v-for="button in buttons"
                    v-on:click="button.action"
                    class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-iherit"
                    tabindex="0">{{ button.text }}</button>
            </div>
        </div>
    </jqm-popup>
</template>

<script>
    import JqmPopup from "./jqm-popup.vue";

    export default {
        components: {
            "jqm-popup": JqmPopup
        },
        props: ["show", "title", "content", "description", "buttons"],
        updated() {
            if (this.show) {
                this.$refs.buttons[0].focus();
            }
        }
    }
</script>
