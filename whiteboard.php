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
<script>
$(document).bind('contextmenu', function(e) {
	$('#vmenu').css({
		top: e.pageY+'px',
		left: e.pageX+'px'
	}).show();
	return false;
});

$(document).ready(function() {
	$('#vmenu').click(function() {
		$('#vmenu').hide();
	});
	$(document).click(function() {
		$('#vmenu').hide();
	});
	whiteboard_id = <?php echo "$whiteboard_id"; ?>;
	alert('hi ' + whiteboard_id);
});
</script>

</head>

<body onload="resizeCanvas();" onresize="resizeCanvas();">

<header>
</header>

<div id=vmenu>
<div class=firstLi>Text</div>
<div class=firstLi>Image</div>
<div class=firstLi>Hamburger</div>
</div>


<div id=canvas>
</div>

<?php
include('util/footer.php');
?>

