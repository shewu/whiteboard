<?php
$conn = mysql_connect('localhost', 'whiteboard', 'sherry');
if(!$conn) {
	die("mysql");
}
mysql_select_db("whiteboard");
?>
