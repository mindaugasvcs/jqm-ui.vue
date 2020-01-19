<template>
    <div class="ui-content app-form">
        <form v-on:submit.prevent="submit" novalidate="novalidate" class="ui-body ui-body-inherit ui-corner-all">
            <h2>Password Reset</h2>
            <div class="ui-field-contain">
                <span>Enter your email address</span>
                <jqm-input ref="email" type="email" name="email" v-model="user.email" maxlength="64" placeholder="username@example.com" v-bind:class="{ 'input-error': errors.email.length }"></jqm-input>
                <div v-if="errors.email.length" class="ui-mini">
                    <p v-for="error in errors.email">{{ error }}</p>
                </div>
            </div>
            <button type="submit" class="ui-btn ui-shadow ui-corner-all ui-icon-gear ui-btn-icon-left" v-bind:class="{ 'spin': loading }" v-bind:disabled="loading">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        inject: ["messageBox"],
        data() {
            return {
                loading: false,
                errors: {
                    email: []
                },
                user: {
                    email: null
                }
            };
        },
        methods: {
            submit() {
                this.loading = true;
                this.$http.post('begin-password-reset', this.user).then(response => {
                    this.loading = false;
                    this.messageBox("Password Reset", "Please check your inbox",
                        "We sent you an email with your provisional password.", [{ text: "OK"}]);
                    this.$router.replace({ name: "end.password.reset", query: { redirect: this.$route.query.redirect } });
                }, response => {
                    this.loading = false;
                    if (response.body.errors) {
                        Object.keys(this.errors).forEach((key) => {
                            this.errors[key] = [];
                        });
                        Object.keys(response.body.errors).forEach((key) => {
                            if (typeof this.errors[key] !== "undefined") {
                                this.errors[key].push(response.body.errors[key]);
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            this.$refs.email.focus();
        }
    }
</script>
