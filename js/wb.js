function resizeViewport() {
	var screenViewportHeight = document.documentElement.clientHeight;
	// keep these two values in sync with the css kthx
	var headerHeight = 16;
	var footerHeight = 10;
	document.getElementById('viewport').style.height = screenViewportHeight - headerHeight - footerHeight;
	console.log("resizing to " + (screenViewportHeight - headerHeight - footerHeight));
	return;
}

