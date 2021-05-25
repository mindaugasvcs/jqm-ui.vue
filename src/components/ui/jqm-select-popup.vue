<template>
    <jqm-popup v-bind:show="show" v-bind:origin="origin" v-bind:positionTo="positionTo">
        <div class="ui-selectmenu ui-popup ui-body-inherit ui-overlay-shadow ui-corner-all">
            <div class="ui-header ui-bar-inherit" v-bind:class="[multiple ? '' : 'ui-screen-hidden']">
                <h1 class="ui-title" style="user-select: none;">Choose options</h1>
                <a v-on:click="hide" class="ui-btn ui-btn-left ui-btn-icon-notext ui-icon-delete ui-corner-all" title="Close" role="button" tabindex="0">Close</a>
            </div>
            <form v-if="filterable" v-on:submit.prevent="onSubmit">
                <jqm-input type="search" ref="input" v-model="searchText" v-on:input="base.$emit('input', $event)" v-bind:placeholder="placeholder"></jqm-input>
            </form>
            <ul v-if="multiple" class="ui-selectmenu-list ui-listview">
                <li v-for="(option, key, index) in localOptions" v-bind:key="key" v-bind:class="{'ui-last-child': (index === $lastIndex(localOptions)), 'ui-li-has-icon': icons}">
                    <a tabindex="-1" class="ui-btn ui-btn-icon-right"
                        ref="optionElements"
                        v-bind:class="[(selectedOption.indexOf(key) > -1) ? 'ui-checkbox-on' : 'ui-checkbox-off']"
                        v-on:click="toggleOption(key)"
                        v-on:keydown.enter="toggleOption(key)"
                        v-on:keydown.space="toggleOption(key)"
                        v-on:keydown.up="up"
                        v-on:keydown.down="down"><img v-if="icons" v-bind:src="option.icon" v-bind:alt="option.text" class="ui-li-icon">{{ option.text }}</a>
                </li>
            </ul>
            <ul v-else class="ui-selectmenu-list ui-listview">
                <li v-for="(option, key, index) in localOptions" v-bind:key="key" v-bind:class="{'ui-first-child': (index === 0 && !filterable), 'ui-last-child': (index === $lastIndex(localOptions)), 'ui-li-has-icon': icons}">
                    <a tabindex="-1" class="ui-btn"
                        ref="optionElements"
                        v-bind:class="{'ui-btn-active': (selectedOption === key)}"
                        v-on:click="selectOption(key)"
                        v-on:keydown.enter="selectOption(key)"
                        v-on:keydown.space="selectOption(key)"
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
        props: ["name", "options", "value", "multiple", "filterable", "icons", "show", "origin", "base", "positionTo", "placeholder", "search"],
        data() {
            return {
                // Multiple select is bound to Array (value ? value : text)
                selectedOption: this.value,
                currentIndex: 0,
                searchText: this.search
            };
        },
        updated() {
            if (this.show) {
                if (this.filterable) {
                    this.$refs.input.focus();
                } else if (this.$refs.optionElements[this.currentIndex]) {
                    this.focusCurrentOptionElement();
                }
            } else {
                if (this.$refs.optionElements && this.$refs.optionElements[this.currentIndex]) {
                    this.$refs.optionElements[this.currentIndex].tabIndex = -1;
                }
                this.origin.focus();
            }
        },
        computed: {
            localOptions() {
                if (!this.filterable) {
                    return this.options;
                } else if (!this.searchText) {
                    return {};
                }

                var a = {}, regExp = RegExp(this.searchText, "i");

                for (var key in this.options) {
                    if (regExp.test(this.options[key].text)) {
                        a[key] = this.options[key];
                    }
                }
                return a;
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
            selectOption(key) {
                this.selectedOption = key;
                this.base.$emit('change', key);
                this.hide();
            },
            toggleOption(key) {
                var keyIndex = this.selectedOption.indexOf(key);

                if (keyIndex > -1) {
                    this.selectedOption.splice(keyIndex, 1);
                } else {
                    this.selectedOption.push(key);
                }
                this.base.$emit('change', this.selectedOption);
            },
            focusCurrentOptionElement() {
                this.$refs.optionElements[this.currentIndex].focus();
                this.$refs.optionElements[this.currentIndex].tabIndex = 0;
            },
            hide() {
                this.$emit("update:show", false);
            },
            onSubmit() {
                return false;
            }
        },
        watch: {
            value(newValue, oldValue) {
                this.selectedOption = newValue;
            },
            search(newValue, oldValue) {
                this.searchText = newValue;
                this.base.$emit('input', newValue)
            }
        }
    }
</script>

<style>
.ui-selectmenu.ui-popup .ui-input-search {
    margin-left: .5em;
    margin-right: .5em;
}
</style>