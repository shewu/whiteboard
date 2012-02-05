<?
include('util/header.php');
include('util/mysql.php');

function get_field($key) {
	if($_GET[$key])
		return $_GET[$key];
	if($_POST[$key])
		return $_POST[$key];
	return "";
}

if(get_field('create') == 'yes') {
	$name = get_field('whiteboard_name');
	if($name == '')
		die('no name');
	mysql_query("INSERT INTO whiteboards (name) VALUES ('$name')") or die('could not insert');
	$id = mysql_insert_id();
} else {
	$id = intval(get_field('whiteboard_id'));
}

echo "viewing whiteboard with id $id";

?>

<body onload="resizeCanvas()" onresize="resizeCanvas()">

<canvas>
</canvas>

<?
include('util/footer.php');
?>

