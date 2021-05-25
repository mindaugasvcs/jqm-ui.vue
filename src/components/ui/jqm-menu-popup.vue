k<template>
    <jqm-popup v-bind:show="show" v-bind:origin="origin" v-bind:positionTo="positionTo" transition="slideup">
        <div class="ui-popup ui-body-inherit ui-overlay-shadow ui-corner-all">
            <ul style="min-width: 160px;" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">
                <li v-if="header" class="ui-li-divider ui-bar-inherit ui-first-child">{{ header }}</li>
                <li v-for="(option, key, index) in options" v-bind:key="key" v-bind:class="{'ui-first-child': (!header && index === 0), 'ui-last-child': (index === $lastIndex(options)), 'ui-li-has-icon': icons}">
                    <a tabindex="-1" class="ui-btn ui-btn-icon-right"
                        ref="optionElements"
                        v-bind:class="option.iconClass"
                        v-on:click="hide(); option.action();"
                        v-on:keydown.enter="hide(); option.action();"
                        v-on:keydown.up="up"
                        v-on:keydown.down="down"><img v-if="icons" v-bind:src="option.icon" v-bind:alt="option.text" class="ui-li-icon">{{ option.text }}</a>
                </li>
            </ul>
        </div>
    </jqm-popup>
</template>

<script>
    import JqmPopup from "./jqm-popup.vue";

    export default {
        components: {
            "jqm-popup": JqmPopup
        },
        props: ["name", "options", "icons", "show", "origin", "positionTo", "header"],
        data() {
            return {
                currentIndex: 0
            };
        },
        updated() {
            if (this.show) {
                if (this.$refs.optionElements[this.currentIndex]) {
                    this.focusCurrentOptionElement();
                }
            } else {
                if (this.$refs.optionElements && this.$refs.optionElements[this.currentIndex]) {
                    this.$refs.optionElements[this.currentIndex].tabIndex = -1;
                }
                this.origin.focus();
            }
        },
        methods: {
            up() {
                if (this.currentIndex > 0) {
                    this.$refs.optionElements[this.currentIndex].tabIndex = -1;
                    this.currentIndex--;
                    this.focusCurrentOptionElement();
                }
            },
            down() {
                if (this.currentIndex < (this.$refs.optionElements.length - 1)) {
                    this.$refs.optionElements[this.currentIndex].tabIndex = -1;
                    this.currentIndex++;
                    this.focusCurrentOptionElement();
                }
            },
            focusCurrentOptionElement() {
                this.$refs.optionElements[this.currentIndex].focus();
                this.$refs.optionElements[this.currentIndex].tabIndex = 0;
            },
            hide() {
                this.$emit("update:show", false);
            }
        }
    }
</script>
