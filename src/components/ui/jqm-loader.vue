<template>
    <div class="ui-loader ui-loader-verbose" v-bind:class="classArray" v-bind:style="{ display: show ? 'block' : 'none' }">
        <svg height="46" width="46" viewBox="23 23 46 46">
            <circle ref="circle" transform="rotate(-90 46 46)" stroke-dasharray="125.6637" stroke-dashoffset="125.6637" stroke="currentColor" stroke-width="6" fill="transparent" r="20" cx="46" cy="46" />
        </svg>
        <small>{{ text }}</small>
    </div>
</template>

<script>
    export default {
        props: {
            show: Boolean,
            percent: Number,
            text: String,
            swatch: {
                type: String,
                default: "inherit"
            },
            corners: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            classArray() {
                return [
                    'ui-body-' + this.swatch,
                    { 'ui-corner-all': this.corners }
                ];
            }
        },
        methods: {
            setProgress(percent) {
                var circumference = 20 * 2 * Math.PI;
                var offset = circumference - percent / 100 * circumference;
                this.$refs.circle.setAttribute("stroke-dashoffset", offset);
            }
        },
        watch: {
            percent(newValue) {
                this.setProgress(newValue);
            }
        }
    }
</script>

<style>
.ui-loader svg {
    display: block;
    margin: 0 auto .625em;
}
.ui-loader small {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>