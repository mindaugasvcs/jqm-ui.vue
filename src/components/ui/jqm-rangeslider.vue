<template>
    <div class="ui-rangeslider" v-bind:class="{ 'ui-mini': mini }">
        <div v-if="tooltip" ref="tooltipFirst" class="ui-slider-popup ui-shadow ui-corner-all ui-body-inherit" v-bind:style="styleObjectFirst">{{ localValueFirst + units }}</div>
        <div v-if="tooltip" ref="tooltipLast" class="ui-slider-popup ui-shadow ui-corner-all ui-body-inherit" v-bind:style="styleObjectLast">{{ localValueLast + units }}</div>
        <input type="number" v-show="!noinput" v-model.number="localValueFirst" v-bind:min="min" v-bind:max="localValueLast - step" v-bind:step="step" class="ui-shadow-inset ui-body-inherit ui-corner-all ui-slider-input ui-rangeslider-first">
        <input type="number" v-show="!noinput" v-model.number="localValueLast" v-bind:min="localValueFirst + step" v-bind:max="max" v-bind:step="step" class="ui-shadow-inset ui-body-inherit ui-corner-all ui-slider-input ui-rangeslider-last">
        <div class="ui-rangeslider-sliders">
            <div class="ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all" v-bind:class="{ 'ui-mini': mini }">
                <div class="ui-slider-bg ui-btn-active"></div>
            </div>
            <div ref="track" v-on:mousedown="onMouseDownOnTrack" class="ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all" v-bind:class="{ 'ui-mini': mini }">
                <div v-if="highlight" class="ui-slider-bg ui-btn-active" v-bind:style="{width: percentLast - percentFirst + '%', 'margin-left': percentFirst + '%'}"></div>
                <a href="#" class="ui-slider-handle ui-btn ui-shadow"
                    v-bind:style="{left: percentFirst + '%'}"
                    v-bind:title="localValueFirst"
                    v-on:keydown.up="upFirst"
                    v-on:keydown.right="upFirst"
                    v-on:keydown.down="downFirst"
                    v-on:keydown.left="downFirst"
                    v-on:mousedown.prevent="onMouseDownOnHandleFirst"
                    v-on:touchstart.prevent="onTouchStartOnHandleFirst">
                </a>
                <a href="#" class="ui-slider-handle ui-btn ui-shadow"
                    v-bind:style="{left: percentLast + '%'}"
                    v-bind:title="localValueLast"
                    v-on:keydown.up="upLast"
                    v-on:keydown.right="upLast"
                    v-on:keydown.down="downLast"
                    v-on:keydown.left="downLast"
                    v-on:mousedown.prevent="onMouseDownOnHandleLast"
                    v-on:touchstart.prevent="onTouchStartOnHandleLast">
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            step: {
                type: Number,
                default: 1
            },
            value: Array,
            units: {
                type: String,
                default: ""
            },
            tooltip: Boolean,
            highlight: Boolean,
            noinput: Boolean,
            mini: Boolean
        },
        data() {
            return {
                localValueFirst: this.value[0],
                localValueLast: this.value[1],
                showTooltipFirst: false,
                showTooltipLast: false
            };
        },
        watch: {
            localValueFirst(newValue, oldValue) {
                // prevent entering out of range value in input field
                if (newValue >= this.localValueLast || newValue < this.min) {
                    this.localValueFirst = oldValue;
                } else {
                    this.$emit("input", [this.localValueFirst, this.localValueLast]);
                }
            },
            localValueLast(newValue, oldValue) {
                // prevent entering out of range value in input field
                if (newValue > this.max || newValue <= this.localValueFirst) {
                    this.localValueLast = oldValue;
                } else {
                    this.$emit("input", [this.localValueFirst, this.localValueLast]);
                }
            }
        },
        computed: {
            percentFirst() {
                return (this.localValueFirst - this.min) * 100 / (this.max - this.min);
            },
            percentLast() {
                return (this.localValueLast - this.min) * 100 / (this.max - this.min);
            },
            styleObjectFirst() {
                if (!this.showTooltipFirst) {
                    return {
                        visibility: "hidden",
                        top: "0px"
                    };
                }
                var absolute = this.$computeAbsoluteRect(this.$refs.track);
                return {
                    top: absolute.top - this.$refs.tooltipFirst.clientHeight - 16 + "px",
                    left: absolute.left + (absolute.width * this.percentFirst / 100) - (this.$refs.tooltipFirst.clientWidth / 2) + "px"
                };
            },
            styleObjectLast() {
                if (!this.showTooltipLast) {
                    return {
                        visibility: "hidden",
                        top: "0px"
                    };
                }
                var absolute = this.$computeAbsoluteRect(this.$refs.track);
                return {
                    top: absolute.top - this.$refs.tooltipLast.clientHeight - 16 + "px",
                    left: absolute.left + (absolute.width * this.percentLast / 100) - (this.$refs.tooltipLast.clientWidth / 2) + "px"
                };
            }
        },
        methods: {
            upFirst() {
                if (this.localValueFirst < (this.localValueLast - this.step)) {
                    this.localValueFirst += this.step;
                }
            },
            downFirst() {
                if (this.localValueFirst >= (this.min + this.step)) {
                    this.localValueFirst -= this.step;
                }
            },
            upLast() {
                if (this.localValueLast <= (this.max - this.step)) {
                    this.localValueLast += this.step;
                }
            },
            downLast() {
                if (this.localValueLast > (this.localValueFirst + this.step)) {
                    this.localValueLast -= this.step;
                }
            },
            onMouseDownOnTrack(event) {
                var x = this.computeSliderValue(event.currentTarget, event.pageX);
                if (x < ((this.localValueLast - this.localValueFirst) / 2 + this.localValueFirst)) {
                    this.localValueFirst = x;
                } else {
                    this.localValueLast = x;
                }
            },
            onMouseDownOnHandleFirst(event) {
                event.currentTarget.focus();
                document.addEventListener("mousemove", this.mouseMoveHandlerFirst, false);
                document.addEventListener("mouseup", this.mouseUpHandlerFirst, false);
                this.showTooltipFirst = true;
            },
            onMouseDownOnHandleLast(event) {
                event.currentTarget.focus();
                document.addEventListener("mousemove", this.mouseMoveHandlerLast, false);
                document.addEventListener("mouseup", this.mouseUpHandlerLast, false);
                this.showTooltipLast = true;
            },
            mouseMoveHandlerFirst(event) {
                var x = this.computeSliderValue(this.$refs.track, event.pageX);
                if (x <= (this.localValueLast - this.step)) {
                    this.localValueFirst = x;
                }
            },
            mouseMoveHandlerLast(event) {
                var x = this.computeSliderValue(this.$refs.track, event.pageX);
                if (x >= (this.localValueFirst + this.step)) {
                    this.localValueLast = x;
                }
            },
            mouseUpHandlerFirst(event) {
                document.removeEventListener("mousemove", this.mouseMoveHandlerFirst, false);
                document.removeEventListener("mouseup", this.mouseUpHandlerFirst, false);
                this.showTooltipFirst = false;
            },
            mouseUpHandlerLast(event) {
                document.removeEventListener("mousemove", this.mouseMoveHandlerLast, false);
                document.removeEventListener("mouseup", this.mouseUpHandlerLast, false);
                this.showTooltipLast = false;
            },
            onTouchStartOnHandleFirst(event) {
                event.currentTarget.focus();
                event.currentTarget.addEventListener("touchmove", this.touchMoveHandlerFirst, false);
                event.currentTarget.addEventListener("touchend", this.touchEndHandlerFirst, false);
                event.currentTarget.addEventListener("touchcancel", this.touchEndHandlerFirst, false);
                this.showTooltipFirst = true;
            },
            onTouchStartOnHandleLast(event) {
                event.currentTarget.focus();
                event.currentTarget.addEventListener("touchmove", this.touchMoveHandlerLast, false);
                event.currentTarget.addEventListener("touchend", this.touchEndHandlerLast, false);
                event.currentTarget.addEventListener("touchcancel", this.touchEndHandlerLast, false);
                this.showTooltipLast = true;
            },
            touchMoveHandlerFirst(event) {
                var x = this.computeSliderValue(this.$refs.track, event.changedTouches[0].pageX);
                if (x <= (this.localValueLast - this.step)) {
                    this.localValueFirst = x;
                }
            },
            touchMoveHandlerLast(event) {
                var x = this.computeSliderValue(this.$refs.track, event.changedTouches[0].pageX);
                if (x >= (this.localValueFirst + this.step)) {
                    this.localValueLast = x;
                }
            },
            touchEndHandlerFirst(event) {
                event.currentTarget.removeEventListener("touchmove", this.touchMoveHandlerFirst, false);
                event.currentTarget.removeEventListener("touchend", this.touchEndHandlerFirst, false);
                event.currentTarget.removeEventListener("touchcancel", this.touchEndHandlerFirst, false);
                this.showTooltipFirst = false;
            },
            touchEndHandlerLast(event) {
                event.currentTarget.removeEventListener("touchmove", this.touchMoveHandlerLast, false);
                event.currentTarget.removeEventListener("touchend", this.touchEndHandlerLast, false);
                event.currentTarget.removeEventListener("touchcancel", this.touchEndHandlerLast, false);
                this.showTooltipLast = false;
            },
            computeSliderValue(target, pageX) {
                var absolute = this.$computeAbsoluteRect(target);
                var x = (pageX < absolute.left) ? absolute.left : ((pageX > absolute.right) ? absolute.right : pageX);

                return Math.round((((x - absolute.left) / absolute.width) * (this.max - this.min) + this.min) / this.step) * this.step;
            }
        }
    }
</script>
