;
(function($) {

	// 需要调整大小的遮罩元素
	var $MASK_ELEMENTS = [];

	// 窗口调整大小定时器
	var MASK_RESIZE_TIMER;

	$(window).on("resize.mask", function() {

		MASK_RESIZE_TIMER && clearTimeout(MASK_RESIZE_TIMER);

		MASK_RESIZE_TIMER = setTimeout(function() {

			var $body = $(document.body);

			if ($body.hasClass("mask"))
				setIconPosition($body, $body.find("> .mask-icon"));

			for (var i = 0, l = $MASK_ELEMENTS.length; i < l; i++) {

				var $ele = $MASK_ELEMENTS[i];

				var $maskEle = $ele;

				if (!$ele.hasClass("mask")) {

					$maskEle = $ele.parent();

					$maskEle.css({
						width : "",
						height : ""
					});

					$maskEle.width($ele.outerWidth());

					$maskEle.height($ele.outerHeight());

				}

				setIconPosition($maskEle, $maskEle.find("> .mask-icon"));
			}

		}, 20);

	});

	function elementNeedWrap($ele) {

		var tagName = $ele[0].tagName;

		if (tagName == 'TABLE')
			return true;

		return false;
	}

	function getMaskCntRect($ele) {

		if ($ele[0].tagName == 'BODY') {

			var width = window.innerWidth, height = window.innerHeight;

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

		return {
			height : $ele.outerHeight(),
			width : $ele.outerWidth()
		};
	}

	function setIconPosition($maskEle, $icon) {

		var windowRect = getMaskCntRect($maskEle);

		var width = windowRect.width, height = windowRect.height;

		var iheight = $icon.outerHeight(), iwidth = $icon.outerWidth();

		var top = (height - iheight) / 2, left = (width - iwidth) / 2;

		$icon.css({
			top : top + "px",
			left : left + "px"
		});

	}

	// DIV等容器性元素
	function maskElement($ele, options) {

		if ($ele[0].tagName == 'BODY')
			return maskBody($ele, options);

		var maskCount = ($ele.data("masked") || 0) + 1;

		$ele.data("masked", maskCount);

		// 已经开启遮罩了,
		if (maskCount > 1)
			return;

		options.iconCls = options.iconCls || "fa fa-spinner fa-spin fa-3x";

		var $maskEle = $ele;

		$MASK_ELEMENTS.push($ele);

		if (elementNeedWrap($ele)) {

			$maskEle = $ele.wrap('<div></div>').parent();

			$maskEle.width($ele.outerWidth());

			$maskEle.height($ele.outerHeight());
		}

		$maskEle.addClass("mask mask-hidden");

		$maskEle.css("position") == 'static'
				&& $maskEle.addClass("mask-relative");

		var $mask = $('<div class="mask-backdrop"></div>').appendTo($maskEle);

		var $icon = $('<i class="mask-icon ' + options.iconCls + '"></i>')
				.appendTo($maskEle);

		setIconPosition($maskEle, $icon);

	}

	function unMaskElement($ele) {

		if ($ele[0].tagName == 'BODY')
			return unMaskBody($ele);

		var maskCount = ($ele.data("masked") || 0) - 1;

		// 从来没遮罩过
		if (maskCount > 0)
			return $ele.data("masked", maskCount);

		$ele.removeData("masked");

		var $maskEle = $ele.hasClass("mask") ? $ele : $ele.parent();

		$maskEle.removeClass("mask mask-relative mask-hidden");

		$maskEle.find("> .mask-backdrop").remove();

		$maskEle.find("> .mask-icon").remove();

		// 窗口缩放监听从数组中移除出去
		for (var i = 0, l = $MASK_ELEMENTS.length; i < l; i++)
			if ($MASK_ELEMENTS[i].get(0) == $maskEle[0])
				$MASK_ELEMENTS.splice(i, 1);

	}

	function maskBody($ele, options) {

		if ($ele[0].tagName != 'BODY')
			return maskElement($ele, options);

		var maskCount = ($ele.data("masked") || 0) + 1;

		$ele.data("masked", maskCount);

		// 已经开启遮罩了,
		if (maskCount > 1)
			return;

		options.iconCls = options.iconCls || "fa fa-spinner fa-spin fa-5x";

		var $maskEle = $ele.addClass("mask");

		var $mask = $('<div class="mask-backdrop mask-backdrop-fixed"></div>')
				.appendTo($maskEle);

		var $icon = $(
				'<i class="mask-icon mask-icon-fixed ' + options.iconCls
						+ '"></i>').appendTo($maskEle);

		setIconPosition($maskEle, $icon);

	}

	function unMaskBody($ele) {

		if ($ele[0].tagName != 'BODY')
			return unMaskElement($ele);

		var maskCount = ($ele.data("masked") || 0) - 1;

		// 从来没遮罩过
		if (maskCount > 0)
			return $ele.data("masked", maskCount);

		var $maskEle = $ele.removeData("masked");

		$maskEle.removeClass("mask");

		$maskEle.find("> .mask-backdrop").remove();

		$maskEle.find("> .mask-icon").remove();

	}

	/**
	 * Displays loading mask over selected element(s). Accepts both single and
	 * multiple selectors.
	 * 
	 * @param label
	 *            Text message that will be displayed on top of the mask besides
	 *            a spinner (optional). If not provided only mask will be
	 *            displayed without a label or a spinner.
	 * @param delay
	 *            Delay in milliseconds before element is masked (optional). If
	 *            unmask() is called before the delay times out, no mask is
	 *            displayed. This can be used to prevent unnecessary mask
	 *            display for quick processes.
	 */
	$.fn.mask = function(options) {

		options = options || {};

		$(this).each(function() {

			maskElement($(this), options);

		});
	};

	$.fn.unmask = function() {

		$(this).each(function() {

			unMaskElement($(this));

		});
	};

	$.fn.isMasked = function() {

		return (this.data("masked") || 0) > 1;
	};

})(jQuery);