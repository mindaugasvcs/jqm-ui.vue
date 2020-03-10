import './prototypes.js'; // This runs the module's global code, but doesn't actually import any values.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import auth from './auth';
import App from './App.vue';
import { routes } from './routes';
import { messages } from './messages';

// add plug-ins to the vue core
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueI18n);

// Set default values using the global configuration
Vue.http.options.root = 'http://localhost:80'
if (auth.isLoggedIn()) {
    Vue.http.headers.common['Authorization'] = 'Bearer ' + auth.getToken();
}

const router = new VueRouter({
    routes,
    mode: 'history',
    base: '/',
    linkActiveClass: '', // default: "router-link-active"
    linkExactActiveClass: '', // default: "router-link-exact-active"
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else if (to.hash) {
            return { selector: to.hash };
        }
        return { x: 0, y: 0 };
    }
});

// var language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

import JqmSelect from './components/ui/jqm-select.vue';
import JqmSlider from './components/ui/jqm-slider.vue';
import JqmRangeSlider from './components/ui/jqm-rangeslider.vue';
import JqmCheckbox from './components/ui/jqm-checkbox.vue';
import JqmRadiobox from './components/ui/jqm-radiobox.vue';
import JqmInput from './components/ui/jqm-input.vue';
import JqmTextarea from './components/ui/jqm-textarea.vue';
import JqmDate from './components/ui/jqm-date.vue';

// These components are globally registered
Vue.component('jqm-select', JqmSelect);
Vue.component('jqm-slider', JqmSlider);
Vue.component('jqm-rangeslider', JqmRangeSlider);
Vue.component('jqm-checkbox', JqmCheckbox);
Vue.component('jqm-radiobox', JqmRadiobox);
Vue.component('jqm-input', JqmInput);
Vue.component('jqm-textarea', JqmTextarea);
Vue.component('jqm-date', JqmDate);

// Some helper functions
// methods added to a prototype in JavaScript gain the context of the instance
Vue.prototype.$computeAbsoluteRect = function(element) {
    var relative = element.getBoundingClientRect();
    return {
        left: relative.left + window.pageXOffset,
        top: relative.top + window.pageYOffset,
        right: relative.right + window.pageXOffset,
        bottom: relative.bottom + window.pageYOffset,
        width: relative.width,
        height: relative.height
    };
}
Vue.prototype.$isObjectEmpty = function(object) {
    return Object.keys(object).length === 0;
}
Vue.prototype.$lastIndex = function(object) {
    return Object.keys(object).length - 1;
}

new Vue({
    el: '#app',
    router,
    i18n,
    render: h => h(App)
});
