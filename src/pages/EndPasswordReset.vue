<template>
    <div class="ui-content app-form">
        <form v-on:submit.prevent="submit" novalidate="novalidate" class="ui-body ui-body-inherit ui-corner-all">
            <h2>Reset Password</h2>
            <div class="ui-field-contain">
                <span>Provisional Password</span>
                <jqm-input ref="provisional" type="password" name="provisional" v-model="user.provisional" maxlength="30" placeholder="Password" v-bind:class="{ 'input-error': errors.provisional.length }"></jqm-input>
                <div v-if="errors.provisional.length" class="ui-mini">
                    <p v-for="error in errors.provisional">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>New Password</span>
                <jqm-input type="password" name="password" v-model="user.password" maxlength="30" placeholder="Password" v-bind:class="{ 'input-error': errors.password.length }"></jqm-input>
                <div v-if="errors.password.length" class="ui-mini">
                    <p v-for="error in errors.password">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>Confirm New Password</span>
                <jqm-input type="password" name="confirm" v-model="user.confirm" maxlength="30" placeholder="Password" v-bind:class="{ 'input-error': errors.confirm.length }"></jqm-input>
                <div v-if="errors.confirm.length" class="ui-mini">
                    <p v-for="error in errors.confirm">{{ error }}</p>
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
                    provisional: [],
                    password: [],
                    confirm: []
                },
                user: {
                    provisional: null,
                    password: null,
                    confirm: null
                }
            };
        },
        methods: {
            submit() {
                this.loading = true;
                this.$http.post('end-password-reset', this.user).then(response => {
                    this.loading = false;
                    this.messageBox("", "Done", "Your password was changed.", [{ text: "OK"}]);
                    this.$router.replace({ name: "login", query: { redirect: this.$route.query.redirect } });
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
                    } else {
                        this.$router.replace({ name: "begin.password.reset", query: { redirect: this.$route.query.redirect } });
                    }
                });
            }
        },
        mounted() {
            this.$refs.provisional.focus();
        }
    }
</script>
