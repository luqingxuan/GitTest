<include src="./commonJs.tpl"></include>

<script type="text/javascript">
	//如果 <select> 元素应用了 border-radius 和/或 border 样式，Android 系统默认的浏览器将不会显示侧边栏控件。
	function fixAndroidSelect() {                                        
		var nua = navigator.userAgent;
		var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
		if (isAndroid) {
			$('select.form-control').removeClass('form-control').css('width','100%');
		}
	}
	
	$(fixAndroidSelect);
</script>
