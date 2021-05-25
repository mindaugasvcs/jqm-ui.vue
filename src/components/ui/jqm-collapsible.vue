<template>
    <fieldset v-if="form" class="ui-collapsible ui-collapsible-themed-content" v-bind:class="collapsibleClasses">
        <div class="ui-collapsible-heading" v-bind:class="{ 'ui-collapsible-heading-collapsed': localCollapsed }">
            <a v-on:click="toggle" class="ui-collapsible-heading-toggle ui-btn" v-bind:class="btnClasses" role="button" tabindex="0">{{ this.text }}<span class="ui-collapsible-heading-status">{{ this.tooltipText }}</span></a>
        </div>
        <div class="ui-collapsible-content ui-body-inherit" v-bind:class="{ 'ui-collapsible-content-collapsed': localCollapsed }">
            <slot></slot>
        </div>
    </fieldset>
    <div v-else class="ui-collapsible ui-collapsible-themed-content" v-bind:class="collapsibleClasses">
        <h2 class="ui-collapsible-heading" v-bind:class="{ 'ui-collapsible-heading-collapsed': localCollapsed }">
            <a v-on:click="toggle" class="ui-collapsible-heading-toggle ui-btn" v-bind:class="btnClasses" role="button" tabindex="0">{{ this.text }}<span class="ui-collapsible-heading-status">{{ this.tooltipText }}</span></a>
        </h2>
        <div class="ui-collapsible-content ui-body-inherit" v-bind:class="{ 'ui-collapsible-content-collapsed': localCollapsed }">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        inject: ["accordion"],
        props: {
            text: String,
            inset: Boolean,
            form: Boolean,
            collapsed: Boolean,
            collapsedIcon: {
                type: String,
                default: "plus"
            },
            expandedIcon: {
                type: String,
                default: "minus"
            },
            iconPosition: {
                type: String,
                default: "left"
            },
            first: Boolean,
            last: Boolean,
            mini: Boolean
        },
        data() {
            return {
                index: null,
                initialCollapsed: this.collapsed
            };
        },
        computed: {
            localCollapsed() {
                if (this.accordion) {
                    return this.index !== this.accordion.expanded;
                } else {
                    return this.initialCollapsed;
                }
            },
            collapsibleClasses() {
                return {
                    'ui-collapsible-inset': this.inset,
                    'ui-corner-all': this.inset,
                    'ui-collapsible-collapsed': this.localCollapsed,
                    'ui-first-child': this.first,
                    'ui-last-child': this.last
                };
            },
            btnClasses() {
                return [
                    'ui-btn-icon-' + this.iconPosition,
                    this.localCollapsed ? 'ui-icon-' + this.collapsedIcon : 'ui-icon-' + this.expandedIcon,
                    { 'ui-mini': this.mini }
                ];
            },
            tooltipText() {
                return this.localCollapsed ? ' click to expand contents' : ' click to collapse contents';
            }
        },
        methods: {
            toggle() {
                if (this.accordion) {
                    if (this.index === this.accordion.expanded) {
                        this.accordion.expanded = null;
                    } else {
                        this.accordion.expanded = this.index;
                    }
                } else {
                    this.initialCollapsed = !this.initialCollapsed;
                }
            }
        },
        created() {
            if (this.accordion) {
                this.index = this.accordion.count++;
            }
        }
    }
</script>
