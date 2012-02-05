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
	var parentOffset = $(this).parent().offset();
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	console.log("relX = " + relX + " relY = " + relY);
	$('canvas').append('<div class=textlet style="margin-top:'+relY+';margin-left:'+relX+';">Hello</div>');
}

