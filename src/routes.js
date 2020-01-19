import auth from './auth';
import Home from './pages/Home.vue';
import Header from './components/layout/headers/Home.vue';
import Footer from './components/layout/Footers/Footer.vue';

import Register from './pages/Register.vue';
import Login from './pages/Login.vue';
import BeginPasswordReset from './pages/BeginPasswordReset.vue';
import EndPasswordReset from './pages/EndPasswordReset.vue';

import PageNotFound from './pages/PageNotFound.vue';

function requireAuth(to, from, next) {
    if (!auth.isLoggedIn()) {
        next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
        next();
    }
}

export const routes = [
    {
        path: '/',
        name: 'home',
        components: { 'header': Header, default: Home, 'footer': Footer }
    },
    {
        path: '/register',
        name: 'register',
        components: { 'header': Header, default: Register, 'footer': Footer }
    },
    {
        path: '/login',
        name: 'login',
        components: { 'header': Header, default: Login, 'footer': Footer }
    },
    {
        path: '/begin-password-reset',
        name: 'begin.password.reset',
        components: { 'header': Header, default: BeginPasswordReset, 'footer': Footer }
    },
    {
        path: '/end-password-reset',
        name: 'end.password.reset',
        components: { 'header': Header, default: EndPasswordReset, 'footer': Footer }
    },
    {
        path: '/logout',
        beforeEnter(to, from, next) {
            auth.logout();
            next('/');
        }
    },
    { path: '*', component: PageNotFound }
];