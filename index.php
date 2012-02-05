<?
include('util/mysql.php');
include('util/header.php');
?>
<body onload="resizeCapsule();" onresize="resizeCapsule();">
<header>
Header
</header>

<div id=capsule>
<?

$query = 'SELECT * FROM whiteboards';
$whiteboards = mysql_query($query) or die('Query failed: ' . mysql_error());
$line = mysql_fetch_array($whiteboards);
if($line) {
	echo '<form name="select_whiteboard_form" action="whiteboard.php" method="POST">';
	echo '<select name="whiteboard_id">';
	do {
		echo '<option value="' . $line[0] . '">' . $line[1] . '</option>';
	} while($line = mysql_fetch_array($whiteboards));
	echo '</select>';
	echo '<input type="submit" value="View board" />';
	echo '</form>';
} else {
	echo 'No whiteboards currently';
}
mysql_free_result($whiteboards);
?>
</div>

<?
include('util/footer.php');
?>

