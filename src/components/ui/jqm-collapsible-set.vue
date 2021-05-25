<template>
    <div class="ui-collapsible-set" v-bind:class="classArray">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: {
            swatch: {
                type: String,
                default: "inherit"
            },
            corners: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                accordion: {
                    count: 0,
                    expanded: 0
                }
            }
        },
        provide() {
            return {
                accordion: this.accordion
            }
        },
        computed: {
            classArray() {
                return [
                    'ui-group-theme-' + this.swatch,
                    { 'ui-corner-all': this.corners }
                ];
            }
        }
    }
</script>