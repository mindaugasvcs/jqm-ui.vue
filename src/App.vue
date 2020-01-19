<template>
    <div id="app" class="ui-page ui-page-theme-a ui-page-active ui-responsive-panel">
        <div ref="panelWrapper" class="ui-panel-wrapper" v-bind:class="classObject">
            <router-view name="header"></router-view>
            <router-view></router-view>
            <router-view name="footer"></router-view>
        </div>
        <component v-for="(popup, key) in popups" v-bind:key="key" v-bind:is="popup.component" v-bind="popup" v-bind:show.sync="popup.show"></component>
    </div>
</template>

<script>
    import auth from './auth';

    import JqmSelectPopup from "./components/ui/jqm-select-popup.vue";
    import JqmDatePickerPopup from "./components/ui/jqm-datepicker-popup.vue";
    import JqmDialogPopup from "./components/ui/jqm-dialog-popup.vue";

    import JqmPanel from "./components/ui/jqm-panel.vue";

    export default {
        name: "app",
        components: {
            "jqm-select-popup": JqmSelectPopup,
            "jqm-datepicker-popup": JqmDatePickerPopup,
            "jqm-dialog-popup": JqmDialogPopup,
            "jqm-panel": JqmPanel
        },
        data() {
            return {
                transitioning: false,
                popups: {
                    leftPanel: { show: false, component: "jqm-panel", position: "left", display: "overlay" },
                    rightPanel: { show: false, component: "jqm-panel", position: "right", display: "push" }
                },

                user: auth.getUser(),
                locales: [
                    { countryCode: "gb", languageCode: "en", languageName: "English" },
                    { countryCode: "lt", languageCode: "lt", languageName: "Lietuvių" }
                ]
            }
        },
        provide() {
            return {
                messageBox: this.messageBox,
                locales: this.locales,
                getUser: this.getUser
            }
        },
        watch: {
            "popups.leftPanel.show": function(newValue, oldValue) {
                if (this.popups.leftPanel.display === "push" || this.popups.leftPanel.display === "reveal") {
                    this.transitioning = true;
                }
            },
            "popups.rightPanel.show": function(newValue, oldValue) {
                if (this.popups.rightPanel.display === "push" || this.popups.rightPanel.display === "reveal") {
                    this.transitioning = true;
                }
            }
        },
        computed: {
            classObject() {
                return (this.popups.leftPanel.display === "push" || this.popups.leftPanel.display === "reveal") ?
                {
                    'ui-panel-animate': this.popups.leftPanel.show ? this.popups.leftPanel.show : this.transitioning,
                    'ui-panel-page-content-position-left': this.popups.leftPanel.show,
                    'ui-panel-page-content-display-push': this.popups.leftPanel.show && this.popups.leftPanel.display === "push",
                    'ui-panel-page-content-display-reveal': this.popups.leftPanel.show && this.popups.leftPanel.display === "reveal",
                    'ui-panel-page-content-open': this.popups.leftPanel.show ? !this.transitioning : this.transitioning
                } : (this.popups.rightPanel.display === "push" || this.popups.rightPanel.display === "reveal") ?
                {
                    'ui-panel-animate': this.popups.rightPanel.show ? this.popups.rightPanel.show : this.transitioning,
                    'ui-panel-page-content-position-right': this.popups.rightPanel.show,
                    'ui-panel-page-content-display-push': this.popups.rightPanel.show && this.popups.rightPanel.display === "push",
                    'ui-panel-page-content-display-reveal': this.popups.rightPanel.show && this.popups.rightPanel.display === "reveal",
                    'ui-panel-page-content-open': this.popups.rightPanel.show ? !this.transitioning : this.transitioning
                } : {};
            }
        },
        created() {
            this.$root.$on("create-popup", (properties) => {
                // Due to limitations of modern JavaScript, Vue cannot detect property addition or deletion.
                // this.popups[properties.name] = properties;
                // this.$forceUpdate();
                this.$set(this.popups, properties.name, properties);
            });
            this.$root.$on("update-popup", (properties) => {
                this.$set(this.popups[properties.popupName], properties.property, properties.value);
            });
            this.$root.$on("show-popup", (popupName) => {
                this.$set(this.popups[popupName], "show", true);
            });
            this.$root.$on("hide-popup", (popupName) => {
                this.$set(this.popups[popupName], "show", false);
            });

            auth.onChange = (user) => {
                this.user = user;
            }
        },
        methods: {
            messageBox(title, content, description, buttons) {
                var name = "dialog";

                for (var i = 0; i < buttons.length; i++) {
                    if (!buttons[i].action) {
                        buttons[i]["action"] = () => this.$root.$emit("hide-popup", name);
                    }
                }

                this.$root.$emit("create-popup", {
                    component: "jqm-dialog-popup",
                    name: name,
                    title: title,
                    content: content,
                    description: description,
                    buttons: buttons
                });

                setTimeout(() => this.$root.$emit("show-popup", name), 100);
            },
            getUser() {
                return this.user;
            },
            goBack() {
                window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
            },
            transitionEndListener() {
                this.transitioning = false;
            }
        },
        mounted() {
            if (this.$refs.panelWrapper.style.transition !== undefined) {
                this.$refs.panelWrapper.addEventListener("transitionend", this.transitionEndListener);
            } else if (this.$refs.panelWrapper.style.WebkitTransition !== undefined) {
                this.$refs.panelWrapper.addEventListener("webkitTransitionEnd", this.transitionEndListener);
            }
        }
    }
</script>

<style>
    .ui-page, .ui-panel-wrapper {
        height: 100%;
    }
    .ui-content.app-form {
        max-width: 20em;
        margin: auto;
    }
    .input-error {
        box-shadow: 0 0 12px #f00;
    }
    .ui-field-contain small {
        display: block;
        text-align: right;
    }
    .spin::after {
        -webkit-animation: spin 2s infinite linear;        
        animation: spin 2s infinite linear;        
    }
    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(359deg);
        }   
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(359deg);
        }
    }
</style>