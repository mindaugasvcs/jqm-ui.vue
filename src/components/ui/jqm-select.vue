<template>
    <div class="ui-select" v-bind:class="{ 'ui-mini': mini }">
        <a class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"
            v-bind:class="[{ 'ui-li-has-count': multiple, 'ui-first-child': first, 'ui-last-child': last }, classes]"
            v-bind:ref="name"
            v-on:click="onClick"
            v-on:keydown.enter="onClick"
            v-on:keydown.space="onClick"
            tabindex="0">
            <span v-bind:style="{ display: 'flex' }">
                <slot v-if="icons"></slot>
                <span v-else>{{ selectedOptionsText }}</span>
            </span>
            <span v-if="multiple && selectedOptionsCount > 1" class="ui-li-count ui-body-inherit">{{ selectedOptionsCount }}</span>
        </a>
        <select
            v-bind:value="value"
            v-on:change="$emit('change', $event.target.value)"
            v-on:input="$emit('input', $event.target.value)"
            v-bind:multiple="multiple"
            v-bind:name="name"
            tabindex="-1">
            <option v-for="(option, key) in options" v-bind:value="key">{{ option.text }}</option>
        </select>
    </div>
</template>

<script>
    export default {
        model: {
            prop: "value",
            event: "change"
        },
        // Multiple select is bound to Array (value ? value : text)
        props: ["name", "options", "value", "multiple", "filterable", "icons", "first", "last", "mini", "positionTo", "placeholder", "classes", "search"],
        computed: {
            selectedOptionsCount() {
                if (this.value) {
                    if (typeof this.value === "string") {
                        return 1;
                    } else {
                        return this.value.length;
                    }
                }
                return 0;
            },
            selectedOptionsText() {
                var optionsText = "";

                if (this.value) {
                    if (typeof this.value === "string") {
                        optionsText = this.options[this.value].text;
                    } else {
                        optionsText = this.value.reduce((accumulator, currentValue) => {
                            accumulator[accumulator.length] = this.options[currentValue].text;
                            return accumulator;
                        }, []).join(", ");
                    }
                }
                if (this.multiple) {
                    if (!optionsText) optionsText = "Choose options";
                } else {
                    if (!optionsText) optionsText = "Choose one";
                }
                return optionsText;
            }
        },
        methods: {
            onClick() {
                this.$root.$emit("show-popup", this.name);
            }
        },
        watch: {
            options(newValue, oldValue) {
                this.$root.$emit("update-popup", {
                    popupName: this.name,
                    property: "options",
                    value: newValue
                });
            },
            value(newValue, oldValue) {
                this.$root.$emit("update-popup", {
                    popupName: this.name,
                    property: "value",
                    value: newValue
                });
            },
            search(newValue, oldValue) {
                this.$root.$emit("update-popup", {
                    popupName: this.name,
                    property: "search",
                    value: newValue
                });
            }
        },
        mounted() {
            this.$root.$emit("create-popup", {
                component: "jqm-select-popup",
                name: this.name,
                options: this.options,
                value: this.value,
                multiple: this.multiple,
                filterable: this.filterable,
                icons: this.icons,
                origin: this.$refs[this.name],
                base: this,
                positionTo: this.positionTo,
                placeholder: this.placeholder,
                search: this.search
            });
        }
    }
</script>
