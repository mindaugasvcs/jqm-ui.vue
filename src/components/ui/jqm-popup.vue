<template>
    <div>
        <div v-on:click="hide" class="ui-popup-screen ui-overlay-inherit" v-bind:class="[ show ? 'in' : 'ui-screen-hidden' ]"></div>
        <div v-on:keydown.esc="hide" v-on:focusout="onFocusout" ref="popupContainer" class="ui-popup-container" v-bind:class="classes" v-bind:style="styles" tabindex="-1">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            show: Boolean,
            origin: HTMLElement,
            positionTo: String,
            transition: String,
            dismissible: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                style: { }
            };
        },
        computed: {
            classes() {
                return [
                    this.transition ? this.transition : "",
                    {
                        in: this.show,
                        "ui-popup-active": !this.transition && this.show,
                        out: !this.show,
                        reverse: !this.show,
                        "ui-popup-hidden": !this.transition && !this.show
                        // "ui-popup-truncate": ** not possible to measure the popup if it has 'display: none' style **
                    }
                ];
            },
            styles() {
                if (!this.show) return this.style; // trigger re-compute on show

                if (this.positionTo === "window") {
                    if (document.body.clientHeight > this.$refs.popupContainer.clientHeight) {
                        this.style["top"] = document.body.clientHeight / 2 - (this.$refs.popupContainer.clientHeight / 2) + "px";
                    } else {
                        this.style["top"] = "8px";
                    }
                    this.style["left"] = document.body.clientWidth / 2 - (this.$refs.popupContainer.clientWidth / 2) + "px";
                } else if (this.positionTo === "origin") {
                    var absolute = this.$computeAbsoluteRect(this.origin);

                    if ((absolute.top + (absolute.height / 2)) > (this.$refs.popupContainer.clientHeight / 2)) {
                        this.style["top"] = absolute.top + (absolute.height / 2) - (this.$refs.popupContainer.clientHeight / 2) + "px";
                    } else {
                        this.style["top"] = "8px";
                    }

                    if ((absolute.left + (absolute.width / 2)) > (this.$refs.popupContainer.clientWidth / 2)) {
                        if ((document.body.scrollWidth - (absolute.left + (absolute.width / 2))) > (this.$refs.popupContainer.clientWidth / 2)) {
                            this.style["left"] = absolute.left + (absolute.width / 2) - (this.$refs.popupContainer.clientWidth / 2) + "px";
                        } else {
                            this.style["right"] = "8px";
                        }
                    } else {
                        this.style["left"] = "8px";
                    }
                } else {
                    var absolute = this.$computeAbsoluteRect(this.origin);

                    this.style["top"] = absolute.bottom + "px";
                    if (absolute.left < (document.body.scrollWidth - absolute.right)) {
                        this.style["left"] = absolute.left + "px";
                    } else {
                        this.style["right"] = (document.body.scrollWidth - absolute.right) + "px";
                    }
                }

                this.style["max-width"] = document.body.clientWidth + "px";
                return this.style;
            }
        },
        methods: {
            hide() {
                if (this.dismissible) {
                    this.$parent.$emit("update:show", false);
                }
            },
            animationStartListener() {
                if (this.show) {
                    this.$refs.popupContainer.classList.remove("ui-popup-hidden");
                } else {
                    this.$refs.popupContainer.classList.remove("ui-popup-active");
                }
            },
            animationEndListener() {
                if (this.show) {
                    this.$refs.popupContainer.classList.add("ui-popup-active");
                } else {
                    this.$refs.popupContainer.classList.add("ui-popup-hidden");
                }
            },
            onFocusout(event) {
                if (!event.relatedTarget || !this.$refs.popupContainer.contains(event.relatedTarget)) {
                    this.hide();
                }
            }
        },
        mounted() {
            if (this.transition) {
                this.animationEndListener();
                if (this.$refs.popupContainer.style.animationName !== undefined) {
                    this.$refs.popupContainer.addEventListener("animationstart", this.animationStartListener);
                    this.$refs.popupContainer.addEventListener("animationend", this.animationEndListener);
                } else if (this.$refs.popupContainer.style.WebkitAnimationName !== undefined) {
                    this.$refs.popupContainer.addEventListener("webkitAnimationStart", this.animationStartListener);
                    this.$refs.popupContainer.addEventListener("webkitAnimationEnd", this.animationEndListener);
                }
            }
        }
    }
</script>
