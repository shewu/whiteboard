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
	$result = mysql_query("SELECT name FROM whiteboards WHERE id=$whiteboard_id") or die('select query failed');
	$row = mysql_fetch_array($result, MYSQL_ASSOC);
	if($row) {
		$name = $row[0];
	} else {
		die('no whiteboard with that id');
	}
	mysql_free_result($result);
}

echo "viewing whiteboard $name";

?>

<body onload="resizeCanvas()" onresize="resizeCanvas()">

<div id=canvas>
</div>

<?
include('util/footer.php');
?>

