function resizeViewport() {
	var screenViewportHeight = document.documentElement.clientHeight;
	var headerHeight = document.getElementsByTagName('header')[0].style.height;
	var footerHeight = document.getElementsByTagName('footer')[0].style.height;
	document.getElementById('viewport').style.height = screenViewportHeight - headerHeight - footerHeight;
	return;
}
