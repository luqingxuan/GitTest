<script type="text/javascript">
	//iframe ? say no
	 if (window != top) 
	 	top.location.href = location.href;

	//for IE6~IE8,IE10+浏览器已经跟条件注释say goodbye了
	if (!document.addEventListener)
	    document.write('<script src="/assets/js/shim.js"><\/script>');	
</script>