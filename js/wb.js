function resizeCapsule() {
	var screenViewportHeight = document.documentElement.clientHeight;
	// keep these two values in sync with the css kthx
	var headerHeight = 16;
	var footerHeight = 12;
	document.getElementById('capsule').style.height = screenViewportHeight - headerHeight - footerHeight - 1 + 'px';
	return;
}

function resizeViewport() {
	var screenViewportHeight = document.documentElement.clientHeight;
	// keep these two values in sync with the css kthx
	var headerHeight = 16;
	var footerHeight = 12;
	document.getElementById('viewport').style.height = screenViewportHeight - headerHeight - footerHeight - 1 + 'px';
	return;
}

