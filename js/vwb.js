$(document).bind('contextmenu', function(e) {
	$('#objmenu').hide();
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
	$('#objmenu').click(function() {
		$('#objmenu').hide();
	});
	$(document).click(function() {
		$('#vmenu').hide();
		$('#objmenu').hide();
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
		$('#imgUploadFile').click();
	});
	$('[name=imgRadio]').filter('[value=url]').click(function() {
		$('#imgUploadURL').focus();
		$('#imgUploadURL').select();
	});
	menuEvent = null;
});
