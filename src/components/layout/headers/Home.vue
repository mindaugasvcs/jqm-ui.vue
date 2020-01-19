<template>
    <div class="ui-header ui-bar-inherit">
        <h1 class="ui-title">Demo</h1>
        <fieldset class="ui-controlgroup ui-controlgroup-horizontal ui-corner-all ui-mini ui-btn-right">
            <div class="ui-controlgroup-controls">
                <router-link :to="{ name: 'login', query: { redirect: $route.query.redirect }}" class="ui-btn ui-btn-icon-left ui-icon-lock ui-first-child">{{ $t('login') }}</router-link>
                <jqm-select name="language" v-model="$i18n.locale" v-bind:options="options" v-bind:last="true" v-bind:icons="true">
                    <img v-bind:src="options[$i18n.locale].icon" v-bind:alt="options[$i18n.locale].text" style="margin-right: 0.5em;">
                </jqm-select>
            </div>
        </fieldset>
    </div>
</template>

<script>
    export default {
        inject: ["getUser", "locales"],
        computed: {
            options() {
                return this.locales.reduce(function(accumulator, currentValue) {
                    accumulator[currentValue.languageCode] = {
                        text: currentValue.languageName,
                        icon: '/static/images/flags/'+ currentValue.countryCode + '.png'
                    };
                    return accumulator;
                }, {});
            }
        }
    }
</script>
