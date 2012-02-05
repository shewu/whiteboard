<?php
$conn = mysql_connect('localhost', 'whiteboard', 'sherry');
if(!$conn) {
	die("mysql");
}
mysql_select_db('whiteboard') or die('Could not select database whiteboard');

function get_whiteboards() {
	$query = 'SELECT * FROM whiteboards';
	$result = mysql_query($query) or die('Query failed: ' . mysql_error());
	return $result;
}
?>
