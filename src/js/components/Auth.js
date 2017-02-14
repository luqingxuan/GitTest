import Storage from './Storage.js';
window.Storage = Storage;

const UserSaltKey = 'UserSalt';
const UserTokenKey = 'UserToken';
const UserIdKey = 'UserId';
const UserNameKey = 'UserName';
const UserProfileKey = 'UserProfile';
const UserTokenExpires = 1000 * 60 * 30;

const Auth = {
    serializeKey: function(key) {
        let salt = this.getSalt();
        return Object(salt).toString() + '^' + key;
    },
    setSalt: function(salt = '') {
        Storage.setItem(UserSaltKey, salt);
    },
    getSalt: function(def = '') {
        return Storage.getItem(UserSaltKey,
            def);
    },
    getItem: function(key, def) {
        key = this.serializeKey(key);
        return Storage.getItem(key, def);
    },
    setItem: function(key, value,
        timeout) {
        key = this.serializeKey(key);
        Storage.setItem(key, value, timeout);
    },
    removeItem: function(key) {
        key = this.serializeKey(key);
        Storage.removeItem(key);
    },
    getUserToken: function(def = false) {
        return this.getItem(UserTokenKey, def);
    },
    setUserToken: function(userToken) {
        this.setItem(UserTokenKey, userToken, UserTokenExpires);
    },
    isValid: function() {
        return !!this.getUserToken();
    },
    setValid: function(userToken) {
        userToken = userToken || this.getUserToken();
        this.setInvalid();
        this.setUserToken(userToken);
    },
    setInvalid: function() {
        this.removeItem(UserTokenKey);
    },
    getUserId: function(def = '') {
        return this.getItem(UserIdKey, def);
    },
    setUserId: function(userId) {
        this.setItem(UserIdKey, userId);
    },
    getUserName: function(def = '') {
        return this.getItem(UserNameKey, def);
    },
    setUserName: function(userName) {
        this.setItem(UserNameKey, userName);
    },
    setUserProfile: function(value) {
        this.setItem(UserProfileKey, value);
    },
    getUserProfile: function(def = {}) {
        return this.getItem(UserProfileKey, def);
    },
    login: function(salt = '', userToken = '', userId = '', userName = '', userProfile = {}) {
        this.setSalt(salt);
        this.setUserToken(userToken);
        this.setUserId(userId);
        this.setUserName(userName);
        this.setUserProfile(userProfile);
    },
    logout: function() {
        this.setSalt('');
        this.setInvalid();
        this.removeItem(UserIdKey);
        this.removeItem(UserNameKey);
        this.removeItem(UserProfileKey);
    }
};

export default Auth;
