<?php
$conn = mysql_connect('localhost', 'whiteboard', 'sherry');
if(!$conn) {
	die("mysql");
}
echo "OK";
?>
