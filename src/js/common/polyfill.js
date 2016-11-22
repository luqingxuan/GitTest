// ES6 Object.assign fix
require('core-js/es6/object');

// ES6 Fetch Object fix
require('fetch-polyfill');

// ES6 Promise Object fix
require('es6-promise').polyfill();

/** ******************************************************************* */
/** **************************$$$$$$$********************************** */
/** ******************************************************************* */

// IE9+ Sortable排序插件
$.Sortable = require('sortablejs');

// 本地存储插件
$.Storage = require('jstorage');

// cookie
$.Cookies = require("js-cookie");

// 数值/货币格式化插件
$.Accounting = require("accounting");

// XSS过滤
$.XSS = require("xss");

/** ******************************************************************* */
/** **************************$$$$$$$********************************** */
/** ******************************************************************* */

window.$ = $;

// 国际化支持
moment.locale('zh-CN');

// 解决严格模式下，没有声明就使用的报错
window.moment = moment;

/** ******************************************************************* */
/** **************************$$$$$$$********************************** */
/** ******************************************************************* */

// 修正jQuery插件样式
require('css/polyfill/jquery.css');

// 修正SexyButton插件样式
require('css/polyfill/sexybuttons.css');

// 修正bootstrap样式
require('css/polyfill/bootstrap.css');
