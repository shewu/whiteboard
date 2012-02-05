$(document).bind('contextmenu', function(e) {
	$('#vmenu').css({
		top: (e.pageY-10)+'px',
		left: (e.pageX-10)+'px'
	}).show();
	menuEvent = e;
	return false;
});

$(document).ready(function() {
	$('#vmenu').click(function() {
		$('#vmenu').hide();
	});
	$(document).click(function() {
		$('#vmenu').hide();
	});
	$('#imgUploadForm').bind('contextmenu',function(e) {
		e.stopPropagation();
	});
	menuEvent = null;
});
