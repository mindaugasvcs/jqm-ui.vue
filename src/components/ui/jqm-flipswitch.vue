<template>
    <span>
        <label>
            <div class="ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all"
                v-bind:class="{ 'ui-flipswitch-active': isChecked, 'ui-focus': focused, 'ui-mini': mini, 'custom-size-flipswitch': wide }">
                <span class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit">{{ onLabel }}</span>
                <span class="ui-flipswitch-off">{{ offLabel }}</span>
                <input type="checkbox" class="ui-flipswitch-input"
                    v-bind:name="name"
                    v-bind:value="value"
                    v-bind:checked="isChecked"
                    v-on:change="updateModel"
                    v-on:focus="focused=true"
                    v-on:blur="focused=false">
            </div>
        </label>
    </span>
</template>

<script>
// If we've got a name of subscribe, and a value of newsletter. When the form is submitted, the data name/value pair will be subscribe=newsletter.
// If the value attribute was omitted, the default value for the checkbox is on , so the submitted data in that case would be subscribe=on.
// If a checkbox is unchecked when its form is submitted, there is no value submitted to the server to represent its unchecked state.
    export default {
        model: {
            prop: "checked",
            event: "change"
        },
        props: {
            name: {
                type: String
            },
            value: {
                type: String
            },
            checked: {
                type: Array
            },
            mini: {
                type: Boolean,
                default: false
            },
            onLabel: {
                type: String,
                default: "ON"
            },
            offLabel: {
                type: String,
                default: "OFF"
            },
            wide: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                focused: false
            };
        },
        computed: {
            isChecked() {
                return this.checked.indexOf(this.value) !== -1;
            }
        },
        methods: {
            updateModel(event) {
                var updatedChecked = this.checked;

                if (event.target.checked) {
                    updatedChecked.push(this.value);
                } else {
                    updatedChecked.splice(updatedChecked.indexOf(this.value), 1);
                }

                this.$emit('change', updatedChecked);
            }
        }
    }
</script>

<style>
.ui-flipswitch .ui-flipswitch-on {
    background: white !important;
    background-image: linear-gradient(rgba(0,0,0,.2), transparent) !important;
    box-shadow: 0 .1em .1em .1em hsla(0,0%,100%,.8) inset, 0 0 .5em rgba(0,0,0,.3) !important;
}
.ui-flipswitch .ui-flipswitch-on:active {
    background-color: #eee !important;
}

/* Custom indentations are needed because the length of custom labels differs from
   the length of the standard labels */
.custom-label-flipswitch.ui-flipswitch .ui-btn.ui-flipswitch-on {
    text-indent: -3.4em;
}
.custom-label-flipswitch.ui-flipswitch .ui-flipswitch-off {
    text-indent: 0.5em;
}

/* Custom indentations are needed because the length of custom labels differs from
   the length of the standard labels */
.custom-size-flipswitch.ui-flipswitch .ui-btn.ui-flipswitch-on {
    text-indent: -5.9em;
}
.custom-size-flipswitch.ui-flipswitch .ui-flipswitch-off {
    text-indent: 0.5em;
}
/* Custom widths are needed because the length of custom labels differs from
   the length of the standard labels */
.custom-size-flipswitch.ui-flipswitch {
    width: 8.875em;
}
.custom-size-flipswitch.ui-flipswitch.ui-flipswitch-active {
    padding-left: 7em;
    width: 1.875em;
}
@media (min-width: 28em) {
    /*Repeated from rule .ui-flipswitch above*/
    .ui-field-contain > label + .custom-size-flipswitch.ui-flipswitch {
        width: 1.875em;
    }
}
</style>