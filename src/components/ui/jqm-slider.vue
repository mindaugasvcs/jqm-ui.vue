<template>
    <div class="ui-slider" v-bind:class="{ 'ui-mini': mini }">
        <div v-if="tooltip" ref="tooltip" class="ui-slider-popup ui-shadow ui-corner-all ui-body-inherit" v-bind:style="styleObject">{{ localValue + units }}</div>
        <input type="number" v-show="!noinput" v-model="localValue" v-bind:min="min" v-bind:max="max" v-bind:step="step" class="ui-shadow-inset ui-body-inherit ui-corner-all ui-slider-input">
        <div ref="track" v-on:mousedown="onMouseDownOnTrack" class="ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all" v-bind:class="{ 'ui-mini': mini }">
            <div v-if="highlight" class="ui-slider-bg ui-btn-active" v-bind:style="{width: percent + '%'}"></div>
            <a href="#" class="ui-slider-handle ui-btn ui-shadow"
                v-bind:style="{left: percent + '%'}"
                v-bind:title="localValue"
                v-on:keydown.up="up"
                v-on:keydown.right="up"
                v-on:keydown.down="down"
                v-on:keydown.left="down"
                v-on:mousedown.prevent="onMouseDownOnHandle"
                v-on:touchstart.prevent="onTouchStartOnHandle">
            </a>
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
            value:  Number,
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
                localValue: this.value,
                showTooltip: false
            };
        },
        watch: {
            localValue(newValue, oldValue) {
                // prevent entering out of range value in input field
                if (newValue > this.max || newValue < this.min) {
                    this.localValue = oldValue;
                } else {
                    this.$emit("input", newValue);
                }
            }
        },
        computed: {
            percent() {
                return (this.localValue - this.min) * 100 / (this.max - this.min);
            },
            styleObject() {
                if (!this.showTooltip) {
                    return {
                        visibility: "hidden",
                        top: "0px"
                    };
                }
                var absolute = this.$computeAbsoluteRect(this.$refs.track);
                return {
                    top: absolute.top - this.$refs.tooltip.clientHeight - 16 + "px",
                    left: absolute.left + (absolute.width * this.percent / 100) - (this.$refs.tooltip.clientWidth / 2) + "px"
                };
            }
        },
        methods: {
            up() {
                if (this.localValue <= (this.max - this.step)) {
                    this.localValue += this.step;
                }
            },
            down() {
                if (this.localValue >= (this.min + this.step)) {
                    this.localValue -= this.step;
                }
            },
            onMouseDownOnTrack(event) {
                this.localValue = this.computeSliderValue(event.currentTarget, event.pageX);
            },
            onMouseDownOnHandle(event) {
                event.currentTarget.focus();
                document.addEventListener("mousemove", this.mouseMoveHandler, false);
                document.addEventListener("mouseup", this.mouseUpHandler, false);
                this.showTooltip = true;
            },
            mouseMoveHandler(event) {
                this.localValue = this.computeSliderValue(this.$refs.track, event.pageX);
            },
            mouseUpHandler(event) {
                document.removeEventListener("mousemove", this.mouseMoveHandler, false);
                document.removeEventListener("mouseup", this.mouseUpHandler, false);
                this.showTooltip = false;
            },
            onTouchStartOnHandle(event) {
                event.currentTarget.focus();
                event.currentTarget.addEventListener("touchmove", this.touchMoveHandler, false);
                event.currentTarget.addEventListener("touchend", this.touchEndHandler, false);
                event.currentTarget.addEventListener("touchcancel", this.touchEndHandler, false);
                this.showTooltip = true;
            },
            touchMoveHandler(event) {
                this.localValue = this.computeSliderValue(this.$refs.track, event.changedTouches[0].pageX);
            },
            touchEndHandler(event) {
                event.currentTarget.removeEventListener("touchmove", this.touchMoveHandler, false);
                event.currentTarget.removeEventListener("touchend", this.touchEndHandler, false);
                event.currentTarget.removeEventListener("touchcancel", this.touchEndHandler, false);
                this.showTooltip = false;
            },
            computeSliderValue(target, pageX) {
                var absolute = this.$computeAbsoluteRect(target);
                var x = (pageX < absolute.left) ? absolute.left : ((pageX > absolute.right) ? absolute.right : pageX);

                return Math.round((((x - absolute.left) / absolute.width) * (this.max - this.min) + this.min) / this.step) * this.step;
            }
        }
    }
</script>

<style>
.ui-slider-track {
    border: 1px solid #929292;
    background: #bababa;
    background: -webkit-gradient(linear,  left top, left bottom,  from(#bababa),color-stop(50%, #f8f8f8),to(#f8f8f8));
    background: -o-linear-gradient(top,  #bababa 0%,#f8f8f8 50%,#f8f8f8 100%);
    background: linear-gradient(to bottom,  #bababa 0%,#f8f8f8 50%,#f8f8f8 100%);
}
.ui-slider-track .ui-btn.ui-slider-handle {
    border: 1px solid #bbbbbb;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,0.75), 0 2px 0 rgba(255,255,255,0.75) inset;
    box-shadow: 0 1px 3px rgba(0,0,0,0.75), 0 2px 0 rgba(255,255,255,0.75) inset;
    background: #fafafa;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(100%, #fafafa), color-stop(0%, #d4d4d4));
    background: -o-linear-gradient(top, #fafafa 100%, #d4d4d4 0%);
    background: linear-gradient(to bottom, #fafafa 100%, #d4d4d4 0%);
}
</style>