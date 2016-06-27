// 计算窗口大小
function windowRect() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	if (typeof width != 'number') {// IE 5/6/7/8
		if (document.compatMode == 'CSS1Compat') {
			width = document.documentElement.clientWidth;
			height = document.docuementElement.clientHeight;
		} else {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
	}

	return {
		width : width,
		height : height
	};
}

export default windowRect;