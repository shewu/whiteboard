<?
include('util/mysql.php');
include('util/header.php');
?>
<body onload="resizeCapsule();" onresize="resizeCapsule();">
<header>
Whiteboard
</header>

<div id=capsule>
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

