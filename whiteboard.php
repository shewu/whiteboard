<?php
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
<script src="js/vwb.js"></script>
<script>
whiteboard_id = <?php echo "$whiteboard_id"; ?>;
</script>

</head>

<body onload="resizeCanvas();" onresize="resizeCanvas();">

<header>
<a href=/whiteboard/>Home</a> - <? echo $name; ?>
</header>

<div id=vmenu class=vmenu>
<div class=firstLi onclick="textMenuHandler(event)">Text</div>
<div class=firstLi onclick="imageMenuHandler(event)">Image</div>
<div class=firstLi onclick="hamburgerMenuHandler(event)">Hamburger</div>
</div>

<div id=objmenu class=vmenu>
<div class=firstLi onclick="objectDeleteMenuHandler(event)">Remove</div>
</div>

<div class=overlayLightbox>
<div class=overlayContent>
<h3>Add an image</h3>
<form enctype="multipart/form-data" id=imgUploadForm action="javascript:processImgUpload()" method=POST>
<table>
<tr><td><input type=radio value=file name=imgRadio /></td><td>Upload an image: <input type=file id=imgUploadFile name=imgUpload /></td></tr>
<tr><td><input type=radio value=url name=imgRadio /></td><td>Paste from source: <input type=text id=imgUploadURL name=imgURL /></td></tr>
</table>
</ul>
<hr/>
<div><input type=submit name=imgUploadSubmit value=Submit /> or <input type=button value=Close onclick="javascript:$('.overlayLightbox').css('display', 'none');" /></div>
</form>
</div>
</div>

<div id=canvas>
</div>

<?php
include('util/footer.php');
?>

