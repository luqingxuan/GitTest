// 滚动条宽度计算
function ScrollbarWidth() {
	var body = document.body;
	var scroll = document.createElement('div');
	scroll.style = 'height: 50px;overflow: scroll;position: absolute;top: -9999px;width: 50px;';
	body.appendChild(scroll);
	var width = scroll.offsetWidth - scroll.clientWidth;
	body.removeChild(scroll);
	return width;
}

export default ScrollbarWidth();