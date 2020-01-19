<template>
    <div class="ui-content app-form">
        <form v-on:submit.prevent="submit" novalidate="novalidate" class="ui-body ui-body-inherit ui-corner-all">
            <h2>Register</h2>
            <div class="ui-field-contain">
                <span>Email</span>
                <jqm-input ref=email type="email" name="email" v-model="user.email" maxlength="64" placeholder="name@example.com" v-bind:class="{ 'input-error': errors.email.length }"></jqm-input>
                <div v-if="errors.email.length" class="ui-mini">
                    <p v-for="error in errors.email">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>User Name</span>
                <jqm-input type="text" name="userName" v-model="user.userName" maxlength="20" placeholder="Your user name" v-bind:class="{ 'input-error': errors.userName.length }"></jqm-input>
                <div v-if="errors.userName.length" class="ui-mini">
                    <p v-for="error in errors.userName">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>Date of birth</span>
                <jqm-date name="dateOfBirth" v-model="user.dateOfBirth" v-bind:language="$i18n.locale" v-bind:classes="{ 'input-error': errors.dateOfBirth.length }"></jqm-date>
                <div v-if="errors.dateOfBirth.length" class="ui-mini">
                    <p v-for="error in errors.dateOfBirth">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>Gender</span>
                <jqm-select name="gender" v-model="user.gender" v-bind:options="genderOptions" v-bind:classes="{ 'input-error': errors.gender.length }"></jqm-select>
                <div v-if="errors.gender.length" class="ui-mini">
                    <p v-for="error in errors.gender">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <span>City</span>
                <jqm-select name="city" v-model="user.locationId" v-on:input="fetchCities" v-bind:options="cityOptions" v-bind:classes="{ 'input-error': errors.locationId.length }" v-bind:filterable="true" placeholder="Find a city..." v-bind:search="searchCity"></jqm-select>
                <div v-if="errors.locationId.length" class="ui-mini">
                    <p v-for="error in errors.locationId">{{ error }}</p>
                </div>
            </div>
            <div class="ui-field-contain">
                <button type="submit" class="ui-btn ui-shadow ui-corner-all ui-icon-gear ui-btn-icon-left" v-bind:class="{ 'spin': loading }" v-bind:disabled="loading">Register</button>
            </div>
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
                    email: [],
                    userName: [],
                    dateOfBirth: [],
                    gender: [],
                    locationId: []
                },
                user: {
                    email: '',
                    userName: '',
                    dateOfBirth: '',
                    gender: null,
                    locationId: null,
                },
                genderOptions: {
                    male: { text: "Male" },
                    female: { text: "Female" }
                },
                cityOptionsRaw: [],
                searchCity: ""
            };
        },
        computed: {
            cityOptions() {
                return this.cityOptionsRaw.reduce(function(accumulator, currentValue) {
                    accumulator[currentValue.locationId] = {
                        text: currentValue.cityName+', '+currentValue.regionName+', '+currentValue.countryName,
                    };
                    return accumulator;
                }, {});
            }
        },
        methods: {
            fetchCities(text) {
                this.loading = true;
                this.$http.get('locations?cityName[like]='+text).then(response => {
                    this.loading = false;
                    this.user.locationId = null;
                    if (response.body) {
                        this.cityOptionsRaw = response.body;
                    } else {
                        this.cityOptionsRaw = [];
                    }
                }, response => {
                    this.loading = false;
                });
            },
            submit() {
                this.loading = true;
                this.$resource('users').save({}, this.user).then((response) => {
                    this.loading = false;
                    this.messageBox("Almost done...", "Please check your inbox",
                        "We sent you an email with your login password.", [{ text: "OK"}]);
                    this.$router.replace({ name: "login", query: { redirect: this.$route.query.redirect } });
                }, (response) => {
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