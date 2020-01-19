import Vue from 'vue';

export default {
    login(user, cb) {
        if (this.isLoggedIn()) {
            if (cb) cb(this.getUser());
            this.onChange(this.getUser());
            return;
        }
        Vue.http.post('login', user).then(response => {
            if (response.body.access_token) {
                this.setToken(response.body.access_token);
                Vue.http.headers.common['Authorization'] = 'Bearer ' + this.getToken();
                if (cb) cb(this.getUser());
                this.onChange(this.getUser());
            } else {
                if (cb) cb(null);
                this.onChange(null);
            }
        }, response => {
            if (cb) cb(null);
            this.onChange(null);
        });
    },
    logout(cb) {
        delete Vue.http.headers.common['Authorization'];
        this.removeToken();
        if (cb) cb(null);
        this.onChange(null);
    },
    isLoggedIn() {
        return !!this.getUser();
    },
    onChange() {
    },
    getUser() {
        var json = this.parseJwtPayload(this.getToken());
        if (json && json.data) {
            return json.data;
        }
        return null;
    },
    getToken() {
        return localStorage.getItem('token');
    },
    setToken(value) {
        localStorage.setItem('token', value);
    },
    removeToken() {
        localStorage.removeItem('token');
    },
    parseJwtPayload(token) {
        if (!token) return null;
        var components = token.split('.');
        if (!components || components.length !== 3) {
            return null;
        }
        return JSON.parse(this.base64UrlDecode(components[1]));
    },
    base64UrlDecode(str) {
        var reminder = str.length % 4;
        if (reminder) {
            str = str.padEnd(str.length + 4 - reminder, "=");
        }
        return decodeURIComponent(escape(atob(str.replace(/\-/g, "+").replace(/_/g, "/"))));
    },
    base64UrlEncode(str) {
        return btoa(unescape(encodeURIComponent(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")));
    }
}
