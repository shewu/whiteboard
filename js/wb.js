
// keep these two values in sync with the css kthx
var headerHeight = 16;
var footerHeight = 12;

function resizeCapsule() {
	var screenViewportHeight = document.documentElement.clientHeight;
	document.getElementById('capsule').style.height = screenViewportHeight - headerHeight - footerHeight - 1 + 'px';
	return;
}

function resizeCanvas() {
	var screenViewportHeight = document.documentElement.clientHeight;
	document.getElementById('canvas').style.height = screenViewportHeight - headerHeight - footerHeight - 1 + 'px';
	return;
}

function createTextlet(e) {
	if (!e) {
		e = window.event;
	}
	var posx = 0, posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	var $textarea = $("<textarea class=textlet style='top:"+posy+"px;left:"+posx+"px'/>");
	$textarea.blur(function() {
		var text = $(this).text();
		var div = $("<div class=textlet style='top:"+posy+"px;left:"+posx+"px'>");
		div.click(function(event) {
			event.stopPropagation();
			var content = $(this).html();
			var ta = $("<textarea/>");
		});
		div.val(text);
		$(this).replaceWith(div);
	});
	$textarea.click(function(event) {
		event.stopPropagation();
	});
	$('#canvas').append($textarea);
	return false;
}

