<template>
    <div class="ui-checkbox" v-bind:class="{ 'ui-mini': mini }">
        <label v-bind:for="id" class="ui-btn ui-btn-inherit ui-btn-icon-left ui-corner-all" v-bind:class="classObject"><slot></slot></label>
        <input type="checkbox" v-bind:checked="isChecked" v-on:change="updateModel" v-bind:id="id" v-bind:name="name" v-bind:value="value">
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
                    'ui-checkbox-on': this.isChecked,
                    'ui-checkbox-off': !this.isChecked,
                    'ui-btn-active': this.horizontal && this.isChecked,
                    'ui-first-child': this.first,
                    'ui-last-child': this.last
                };
            },
            isChecked() {
                return this.checked.indexOf(this.value) !== -1;
            }
        },
        methods: {
            updateModel(event) {
                var updatedChecked = this.checked;

                if (event.target.checked) {
                    updatedChecked.push(this.value);
                } else {
                    updatedChecked.splice(updatedChecked.indexOf(this.value), 1);
                }

                this.$emit('change', updatedChecked);
            }
        }
    }
</script>
