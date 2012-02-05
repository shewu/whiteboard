<?php
require_once("mysql.php");

switch($_GET["action"]) {
	case "get_updates":
		echo get_updates();
		break;
	case "update_object":
		update_object();
		break;
	case "create_connection":
		echo get_new_connetion();
		break;
}

function get_updates() {
	$whiteboard_id = $_GET["whiteboard_id"];
	$connection_id = $_GET["connection_id"];
	$ans = "[ ";
	$old_timestamp = update_user_timestamp($connection_id);
	$query = "SELECT * FROM object_updates JOIN objects ON object_updates.object_id = objects.id 
		WHERE objects.whiteboard_id = $whiteboard_id AND time >= '$old_timestamp'";
	$res = mysql_query($query);
	$row = mysql_fetch_array($res, MYSQL_ASSOC);
	if($row) {
		$ans = $ans . update_to_string($row);
		while($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			$ans = $ans . ", " . update_to_string($row);
		}
	}
	$ans = $ans . " ]";
	return $ans;
}

function get_new_connection() {
	$query = "INSERT INTO user_connections VALUES ( NULL, 0 )";
	mysql_query($query);
	return mysql_insert_id();
}

function update_object() {
	
}

function update_user_timestamp($connection_id) {
	// Updates the user's last pull to the current time and returns the old value
	$query = "SELECT * FROM user_connections WHERE id = $connection_id"; 
	$res = mysql_query($query);
	$row = mysql_fetch_array($res, MYSQL_ASSOC);
	$query = "UPDATE user_connections SET last_pull = NOW() WHERE id = $connection_id";
	mysql_query($query);
	if($row) {
		return $row['last_pull'];
	} else {
		return NULL;
	}
}

function update_to_string($row) {
	$ans = "[ '$row[value]', '$row[style]', $row[position_x], $row[position_y], $row[size_x], $row[size_y] ]";
	return $ans;
}
?>
