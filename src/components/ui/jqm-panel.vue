<template>
    <div>
        <div v-on:keydown.esc="hide" ref="panel" class="ui-panel" v-bind:class="panelClass" tabindex="-1">
            <div class="ui-panel-inner">
                <slot></slot>
            </div>
        </div>
        <div v-on:click="hide" class="ui-panel-dismiss" v-bind:class="panelDismissClass" v-bind:style="{ height: height + 'px' }"></div>
    </div>
</template>

<script>
    export default {
        props: ["position", "display", "show", "theme"],
        data() {
            return {
                height: 240,
                transitioning: false
            };
        },
        watch: {
            show(newValue, oldValue) {
                if (this.display && this.display !== "reveal") {
                    this.transitioning = true;
                }
            }
        },
        computed: {
            panelClass() {
                return [
                    this.theme ? 'ui-body-' + this.theme : 'ui-body-c',
                    {
                        'ui-panel-position-left': this.position === "left",
                        'ui-panel-position-right': this.position === "right",
                        'ui-panel-display-push': this.display === "push",
                        'ui-panel-display-reveal': this.display === "reveal",
                        'ui-panel-display-overlay': this.display === "overlay",
                        'ui-panel-animate': this.display !== undefined,
                        'ui-panel-open': this.show,
                        'ui-panel-closed': !this.show && !this.transitioning
                    }
                ];
            },
            panelDismissClass() {
                return this.show ?
                [
                    {
                        'ui-panel-dismiss-position-left': this.position === "left",
                        'ui-panel-dismiss-position-right': this.position === "right",
                        'ui-panel-dismiss-display-push': this.display === "push",
                        'ui-panel-dismiss-display-reveal': this.display === "reveal",
                        'ui-panel-dismiss-display-overlay': this.display === "overlay"
                    },
                    'ui-panel-dismiss-open'
                ] : [];
            },
        },
        methods: {
            hide() {
                this.$emit('update:show', false);
                this.$parent.$emit("update:show", false);
            },
            transitionEndListener() {
                this.transitioning = false;
            }
        },
        mounted() {
            this.height = this.$refs.panel.scrollHeight;

            if (this.display && this.display !== "reveal") {
                if (this.$refs.panel.style.transition !== undefined) {
                    this.$refs.panel.addEventListener("transitionend", this.transitionEndListener);
                } else if (this.$refs.panel.style.WebkitTransition !== undefined) {
                    this.$refs.panel.addEventListener("webkitTransitionEnd", this.transitionEndListener);
                }
            }
        }
    }
</script>
