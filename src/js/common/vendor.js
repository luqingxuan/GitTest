window.$ = $;

// 解决严格模式下，没有声明就使用的报错
window.moment = moment;

// 国际化支持
moment.locale('zh-CN');

// 修正bootstrap样式
require('../../css/lib/bootstrap-hack.css');

// 修正jQuery插件样式
require('../../css/lib/jquery-hack.css');