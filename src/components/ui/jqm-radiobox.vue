<template>
    <div class="ui-radio" v-bind:class="{ 'ui-mini': mini }">
        <label v-bind:for="id" class="ui-btn ui-btn-inherit ui-btn-icon-left ui-corner-all" v-bind:class="classObject"><slot></slot></label>
        <input type="radio" v-bind:checked="isChecked" v-on:change="$emit('change', $event.target.value)" v-bind:id="id" v-bind:name="name" v-bind:value="value">
    </div>
</template>

<script>
    export default {
        model: {
            prop: "checked",
            event: "change"
        },
        props: ["id", "name", "value", "checked", "horizontal", "first", "last", "mini"],
        computed: {
            classObject() {
                return {
                    'ui-radio-on': this.isChecked,
                    'ui-radio-off': !this.isChecked,
                    'ui-btn-active': this.horizontal && this.isChecked,
                    'ui-first-child': this.first,
                    'ui-last-child': this.last
                };
            },
            isChecked() {
                return this.checked === this.value;
            }
        }
    }
</script>
