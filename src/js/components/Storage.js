const ValueKey = '_v_';

const Storage = $.jStorage;

function toString(sourceValue) {
    let value = {
        [ValueKey]: sourceValue
    };

    return JSON.stringify(value);
};

function toJSON(storedValue) {
    return JSON.parse(storedValue)[ValueKey];
}

function getItem(key, def) {
    let value = Storage.get(key);

    if (value === undefined || value === null)
        return def;

    value = toJSON(value);

    return value === undefined || value === null ? def : value;
}

function setItem(key, value,
    timeout) {
    value = toString(value);

    let options = timeout ? {
        TTL: timeout
    } : {};

    Storage.set(key, value, options);
}

function removeItem(key) {
    Storage.deleteKey(key);
}

function clear() {
    Storage.flush();
}

export default {
    toString,
    toJSON,
    getItem,
    setItem,
    removeItem,
    clear
};
