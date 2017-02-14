require('jstorage');

const ValueKey = '_v_';

const Storage = $.jStorage;

export default {
    getItem: function(key, def) {
        let value = Storage.get(key);

        if (value === undefined || value === null)
            return def;

        value = JSON.parse(value)[ValueKey];

        if (value === undefined)
            return def;

        return value;
    },
    setItem: function(key, value,
        timeout) {
        value = {
            [ValueKey]: value
        };

        value = JSON.stringify(value);

        let options = {};
        if (timeout !== undefined)
            options.TTL = timeout;

        Storage.set(key, value, options);
    },
    removeItem: function(key) {
        Storage.deleteKey(key);
    },
    clear: function() {
        Storage.flush();
    }
};
