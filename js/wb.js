function resizeViewport() {
	var screenViewportHeight = document.documentElement.clientHeight;
	// keep these two values in sync with the css kthx
	console.log("headerHeight = " + document.getElementsByTagName('header')[0].style.height);
	console.log("footerHeight = " + document.getElementsByTagName('footer')[0].style.height);
	var headerHeight = 16;
	var footerHeight = 10;
	document.getElementById('viewport').style.height = screenViewportHeight - headerHeight - footerHeight + 'px';
	console.log("resizing to " + (screenViewportHeight - headerHeight - footerHeight));
	return;
}

