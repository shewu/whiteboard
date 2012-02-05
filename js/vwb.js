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
	$('#imgUploadFile').focus(function() {
		$('[name=imgRadio]').filter('[value=file]').prop("checked",true);
	});
	$('#imgUploadURL').focus(function() {
		$('[name=imgRadio]').filter('[value=url]').prop("checked",true);
	});
	$('[name=imgRadio]').filter('[value=file]').click(function() {
		$('#imgUploadFile').focus();
		$('#imgUploadFile').select();
	});
	$('[name=imgRadio]').filter('[value=url]').click(function() {
		$('#imgUploadURL').click();
	});
	menuEvent = null;
});
