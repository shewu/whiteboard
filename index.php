<?
include('util/mysql.php');
include('util/header.php');
?>
<body onload=resizeCapsule() onresize=resizeCapsule()>
<header>
Whiteboard <em style="flush:right">by Brian Hamrick, Travis Hance, Sherry Wu</em>
</header>

<div id=capsule>
<div>
<?
$query = 'SELECT * FROM whiteboards';
$whiteboards = mysql_query($query) or die('Query failed: ' . mysql_error());
$line = mysql_fetch_array($whiteboards);
if($line) {
	echo '<form name="select_whiteboard_form" action="whiteboard.php" method="GET">';
	echo '<select name="whiteboard_id">';
	do {
		echo "<option value=\"$line[0]\">$line[1]</option>";
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

<div>
<form name="create_whiteboard_form" action="whiteboard.php" method="GET">
<input type="hidden" name="create" value="yes" />
<input type="text" name="whiteboard_name" />
<input type="submit" value="Make whiteboard!" />
</form>
</div>
</div>

<?
include('util/footer.php');
?>

