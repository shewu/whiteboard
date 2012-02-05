<?
include('util/header.php');
include('util/mysql.php');
?>

<body onload="resizeCanvas()" onresize="resizeCanvas()">

<header>
<?
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

echo "viewing whiteboard $name";

?>
</header>

<div id=canvas>
</div>

<?
include('util/footer.php');
?>

