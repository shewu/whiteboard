<?
include('util/mysql.php');
include('util/header.php');
?>

<div id=capsule>
Hello, world! Time to test automatic pulling.
</div>

<?
$whiteboards = get_whiteboards();
if(count($whiteboards) == 0) {
	echo 'No whiteboards currently';
} else {
	echo '<form name="select_whiteboard_form" action="whiteboard.php" method="POST">';
	echo '<select name="whiteboard_id">';
	while ($line = mysql_fetch_array($whiteboards, MYSQL_ASSOC)) {
		echo '<option value="' . $line[0] . '">' . $line[1] . '</option>';
	}
	echo '</select>';
	echo '</form>';
}
mysql_free_result($whiteboards);

include('util/footer.php');
?>

