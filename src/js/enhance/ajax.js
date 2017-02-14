import Auth from 'components/Auth';
window.Auth = Auth;

const redirectLogin = function() {

};

$.ajaxSettings.crossDomain = true;

// 有些AJAX请求不需要做任何过滤，必须确认这些URL与session无关
const FreeURL = [/\/interface\/buildInfo/, /\/user\/login/];

$.ajaxSetup({
    // 使用AJAX要验证登陆状态
    beforeSend: function(xhr) {
        for (let i = 0, l = FreeURL.length; i < l; i++)
            if (FreeURL[i].test(this.url))
                return;

        if (Auth.isValid())
            return;

        redirectLogin();

        return false;
    },
    complete: function(xhr) {
        // 后台Session过期
        if (xhr.status === 401) {
            Auth.setInvalid();
            redirectLogin();
            return;
        }

        for (let i = 0, l = FreeURL.length; i < l; i++)
            if (FreeURL[i].test(this.url))
                return;

            // 更新登陆状态
        Auth.setValid();
    }
});
