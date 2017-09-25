import Storage from 'components/Storage.js';

const SaltKey = 'UserSalt';

const UserKey = 'UserData';

const TokenKey = 'TokenData';

const Auth = {
    serializeKey: function(key) {
        let salt = this.getSalt();

        return Object(salt).toString() + '^' + key;
    },
    setSalt: function(salt = '') {
        Storage.setItem(SaltKey, salt);
    },
    getSalt: function(def = '') {
        return Storage.getItem(SaltKey,
            def);
    },
    getItem: function(key, def) {
        key = this.serializeKey(key);

        return Storage.getItem(key, def);
    },
    setItem: function(key, value,
        timeout) {
        key = this.serializeKey(key);

        this.removeItem(key);

        Storage.setItem(key, value, timeout);
    },
    removeItem: function(key) {
        key = this.serializeKey(key);

        Storage.removeItem(key);
    },
    setUserData: function(userData, expires) {
        this.setItem(UserKey, userData, expires);
    },
    getUserData: function(def = {}) {
        return this.getItem(UserKey, def);
    },
    getUserId: function(def = '') {
        return this.getUserData().id || def;
    },
    getUserName: function(def = '') {
        return this.getUserData().name || def;
    },
    getUserProfile: function(def = false) {
        return this.getUserData().profile || def;
    },
    setTokenData: function(tokenData, expires) {
        tokenData.timestamp = +(new Date());

        this.setItem(TokenKey, tokenData, expires);
    },
    getTokenData: function(def = {}) {
        return this.getItem(TokenKey, def);
    },
    getToken: function(def = false) {
        return this.getTokenData().token || def;
    },
    getTokenExpires: function(def = -1) {
        return this.getTokenData().expires || def;
    },
    getTokenCode: function(def = false) {
        return this.getTokenData().code || def;
    },
    getRefreshToken: function(def = false) {
        return this.getTokenData().refresh || def;
    },
    isValid: function() {
        return !!this.getToken();
    },
    logout: function() {
        this.removeItem(SaltKey);

        this.removeItem(UserKey);

        this.removeItem(TokenKey);

        Storage.clear();
    },
    checkAdmin(appId, userId) {
        let df = $.Deferred();

        if (!userId)
            return df.resolve(false);

        $.ajax({
            url: global.api(`/v1/admin/checkadmin/${userId}/${appId}`)
        }).then((resp) => {
            if (typeof resp == 'string')
                resp = JSON.parse(resp);

            if (resp.status != 200 || !resp.data)
                return df.resolve(false) && resp;

            return df.resolve(resp.data.isAdmin) && resp;
        }, (resp) => {
            return df.resolve(false) && resp;
        });

        return df;
    },
    refreshToken: function(wsp, oauth) {
        let df = $.Deferred();

        let query = [];

        query.push(`code=${this.getTokenCode()}`);
        query.push(`access_token=${this.getToken()}`);
        query.push(`refresh_token=${this.getRefreshToken()}`);

        query.push(`grant_type=refresh_token`);
        query.push(`state=${oauth.state}`);

        query.push(`client_id=${oauth.clientId}`);
        query.push(`client_secret=${oauth.clientSecret}`);

        query.push('redirect_uri=' + encodeURIComponent(`${oauth.redirectUri}`));

        query = query.join('&');

        $.ajax({
            url: global.api(`/v1/ath/token?${query}`)
        }).then((resp) => {
            if (typeof resp == 'string')
                resp = JSON.parse(resp);

            let newTokenData = resp.data;

            if (resp.status != 200 || !newTokenData || !newTokenData.access_token)
                return df.reject(resp) && resp;

            let data = {
                code: this.getTokenCode(),
                token: newTokenData.access_token,
                refresh: newTokenData.refresh_token,
                expires: newTokenData.expires_in * 1000
            };

            df.resolve(data);

            return resp;
        }, (resp) => {
            df.reject(resp);
        });

        return df;
    }
};

module.exports = Auth;
