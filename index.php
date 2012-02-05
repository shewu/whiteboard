<?
include('util/mysql.php');
include('util/header.php');
?>

<div id=viewport>
Hello, world! Time to test automatic pulling.
</div>

<?

$whiteboards = get_whiteboards();
$line = mysql_fetch_array($whiteboards);
if($line) {
	echo '<form name="select_whiteboard_form" action="whiteboard.php" method="POST">';
	echo '<select name="whiteboard_id">';
	do {
		echo '<option value="' . $line[0] . '">' . $line[1] . '</option>';
	} while($line = mysql_fetch_array($whiteboards));
	echo '</select>';
	echo '</form>';
} else {
	echo 'No whiteboards currently';
}
mysql_free_result($whiteboards);

include('util/footer.php');
?>

