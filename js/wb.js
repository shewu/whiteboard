
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

function createTextlet() {
	var e = window.event;
	var posx = 0, posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	var $textarea = "<div class=textlet style='top:"+posy+"px;left:"+posx+"px' onblur='this.contentEditable=false' onclick='this.contentEditable=true' onload='this.contentEditable=true'></div>";
	$('#canvas').append($textarea);
}

