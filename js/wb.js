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
	document.getElementsByTagName('canvas')[0].style.height = screenViewportHeight - footerHeight - 1 + 'px';
	return;
}

