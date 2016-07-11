<script type="text/javascript">
	//iframe ? say no
	 if (window != top) 
	 	top.location.href = location.href;

	//for IE6~IE8,IE10+浏览器已经跟条件注释say goodbye了
	if (!document.addEventListener)
	    document.write('<script src="/assets/js/shim.js"><\/script>');	
	 
	// Internet Explorer 10 并没有对 屏幕的宽度 和 视口（viewport）的宽度 进行区分
	// Copyright 2014-2015 Twitter, Inc.
	//Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	  var msViewportStyle = document.createElement('style');
	  msViewportStyle.appendChild(
	    document.createTextNode(
	      '@-ms-viewport{width:auto!important}'
	    )
	  );
	  document.querySelector('head').appendChild(msViewportStyle);
	}

</script>