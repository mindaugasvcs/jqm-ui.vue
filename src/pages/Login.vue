<template>
    <div class="ui-content app-form">
        <form v-on:submit.prevent="submit" novalidate="novalidate" class="ui-body ui-body-inherit ui-corner-all">
            <h2>Login</h2>
            <p v-if="$route.query.redirect">You need to login first.</p>
            <div class="ui-field-contain">
                <span>User Name</span>
                <jqm-input ref="userName" type="text" name="userName" v-model="user.userName" maxlength="64" placeholder="User Name or Email" v-bind:class="{ 'input-error': errors.userName.length }"></jqm-input>
                <div v-if="errors.userName.length" class="ui-mini">
                    <p v-for="error in errors.userName">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>Password</span>
                <jqm-input type="password" name="password" v-model="user.password" maxlength="30" placeholder="Password" v-bind:class="{ 'input-error': errors.password.length }"></jqm-input>
                <div v-if="errors.password.length" class="ui-mini">
                    <p v-for="error in errors.password">{{ error }}</p>
                </div>
                <small><router-link :to="{ name: 'begin.password.reset'}" class="ui-link">Forgot your password?</router-link></small>
            </div>
            <button type="submit" class="ui-btn ui-shadow ui-corner-all ui-icon-gear ui-btn-icon-left" v-bind:class="{ 'spin': loading }" v-bind:disabled="loading">Login</button>
            <div class="ui-field-contain">
                <small>New here? <router-link :to="{ name: 'register'}" class="ui-link">Register Now!</router-link></small>
            </div>
        </form>
    </div>
</template>

<script>
    import auth from '../auth';
    export default {
        inject: ["messageBox"],
        data() {
            return {
                loading: false,
                errors: {
                    userName: [],
                    password: []
                },
                user: {
                    userName: null,
                    password: null
                }
            };
        },
        methods: {
            submit() {
                if (!this.validate(this.user, this.errors)) return;
                this.loading = true;
                auth.login(this.user, (user) => {
                    this.loading = false;
                    if (user) {
                        this.$router.replace(this.$route.query.redirect || '/');
                    } else {
                        this.messageBox("", "Login Failed", "Did you enter the right credentials?", [{ text: "OK"}]);
                    }
                });
            },
            validate(u, e) {
                Object.keys(e).forEach((key) => {
                    e[key] = [];
                });

                if (!u.userName) {
                    e.userName.push('UserName field is required.');
                }
                if (!u.password) {
                    e.password.push('Password field is required.');
                }

                return Object.keys(e).every((key) => {
                    return e[key].length === 0;
                });
            }
        },
        mounted() {
            this.$refs.userName.focus();
        }
    }
</script>
