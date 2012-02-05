<?php
if (isset($_GET["imgUploadSubmit"])) {
	$iUURL = $_GET["imgURL"];
	$iUFile = $_GET["imgUpload"];
	if (strlen($iUURL) > 0) {
		;
	} else if (strlen($iUFile) > 0) {
		var_dump($_FILES);
		;
	}
}

include('util/mysql.php');

function get_field($key) {
	if($_GET[$key])
		return $_GET[$key];
	if($_POST[$key])
		return $_POST[$key];
	return "";
}

$whiteboard_id = 0;
$name = "";
if(get_field('create') == 'yes') {
	$name = get_field('whiteboard_name');
	if($name == '')
		die('no name');
	mysql_query("INSERT INTO whiteboards (name) VALUES ('" . mysql_real_escape_string($name) . "')") or die('could not insert');
	$whiteboard_id = mysql_insert_id();
} else {
	$whiteboard_id = get_field('whiteboard_id');
	$result = mysql_query("SELECT name FROM whiteboards WHERE id=$whiteboard_id") or die('select query failed');
	$row = mysql_fetch_assoc($result);
	if($row) {
		$name = $row['name'];
	} else {
		die('no whiteboard with that id');
	}
	mysql_free_result($result);
}

?>

<!DOCTYPE html>
<html lang=en>
<head>
<title>Meatboard</title>
<link rel="stylesheet" type="text/css" href="css/main.css" />
<script src="js/jq.js"></script>
<script src="js/wb.js"></script>
<script src="js/fu.js"></script>
<script>
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
	menuEvent = null;
});

whiteboard_id = <?php echo "$whiteboard_id"; ?>;
</script>

</head>

<body onload="resizeCanvas();" onresize="resizeCanvas();">

<header>
</header>

<div id=vmenu>
<div class=firstLi onclick="textMenuHandler(event)">Text</div>
<div class=firstLi onclick="imageMenuHandler(event)">Image</div>
<div class=firstLi onclick="hamburgerMenuHandler(event)">Hamburger</div>
</div>

<div class=overlayLightbox>
<div class=overlayContent>
<h3>Add an image</h3>
<form enctype="multipart/form-data" id=imgUploadForm action="<?php echo $PHP_SELF;?>" method=POST>
<ul>
<li>Upload an image: <input type=file id=imgUploadFile name=imgUpload size=1024 /></li>
<li>Paste from source: <input type=text id=imgUploadURL name=imgURL /></li>
</ul>
<hr/>
<div><input type=submit name=imgUploadSubmit value=Submit /> or <a href="javascript:$('.overlayLightbox').css('display', 'none');">Close</a></div>
</form>
</div>
</div>

<script>
$("form").submit(function() {
	if ($("input #imgUploadURL").val().length() > 0 || $("input #imguploadFile").val().length() > 0) {
		alert("You have uploaded something");
		return true;
	} else {
		alert("Please enter a URL or upload a file!");
		return false;
	}
});
</script>

<div id=canvas>
</div>

<?php
include('util/footer.php');
?>

