<?php
require_once("mysql.php");

switch($_GET["action"]) {
	case "get_updates": // Get updates since the last fetch
		echo get_updates();
		break;
	case "update_object": // Update an object
		update_object();
		break;
	case "create_connection": // Initialize a new connection
		echo get_new_connection();
		break;
	case "get_objects": // Get all object info
		echo get_objects();
		break;
	case "get_all_latest_updates":
		echo get_all_latest_updates();
		break;
}

function get_updates() {
	$whiteboard_id = $_GET["whiteboard_id"];
	$connection_id = $_GET["connection_id"];
	if(!$whiteboard_id || !$connection_id) {
		return NULL;
	}
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
	$whiteboard_id = $_GET["whiteboard_id"];
	if(!$whiteboard_id) {
		return NULL;
	}
	$object_id = $_GET["object_id"];
	if(!$object_id) {
		return NULL;
	}
	// Verify that this object exists
	$query = "SELECT * FROM objects WHERE id = $object_id AND whiteboard_id = $whiteboard_id";
	$res = mysql_query($query);
	if(mysql_num_rows($res) <= 0) {
		return NULL;
	}

	$row = get_object_latest_update($object_id);
	if($_GET["value"]) {
		$row["value"] = $_GET["value"];
	}
	if($_GET["style"]) {
		$row["style"] = $_GET["style"];
	}
	if($_GET["position_x"]) {
		$row["position_x"] = $_GET["position_x"];
	}
	if($_GET["position_y"]) {
		$row["position_y"] = $_GET["position_y"];
	}
	if($_GET["size_x"]) {
		$row["size_x"] = $_GET["size_x"];
	}
	if($_GET["size_y"]) {
		$row["size_y"] = $_GET["size_y"];
	}
	$query = "INSERT INTO object_updates VALUES ( NULL, $object_id, '$row[value]', '$row[style]', $row[position_x], $row[position_y], $row[size_x], $row[size_y], NULL )";
	mysql_query($query);
}

function get_objects() {
	$whiteboard_id = $_GET["whiteboard_id"];
	if(!$whiteboard_id) {
		return NULL;
	}
	$query = "SELECT * FROM objects WHERE whiteboard_id = $whiteboard_id";
	$res = mysql_query($query);
	$row = mysql_fetch_array($res, MYSQL_ASSOC);
	$ans = "[ ";
	if($row) {
		$ans = $ans . object_to_string($row);
		while($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			$ans = $ans . ", " . object_to_string($row);
		}
	}
	$ans = $ans . " ]";
	return $ans;
}

function object_to_string($row) {
	return "[ $row[id], '$row[type]' ]";
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

function get_all_latest_updates() {
	// To be used to initially load the whiteboard
	$whiteboard_id = $_GET["whiteboard_id"];
	if(!$whiteboard_id) {
		return NULL;
	}
	$query = "SELECT * FROM objects WHERE whiteboard_id = $whiteboard_id";
	$res = mysql_query($query);
	$ans = "[ ";
	$row = mysql_fetch_array($res, MYSQL_ASSOC);
	if($row) {
		$ans = $ans . update_to_string(get_object_latest_update($row["id"]));
		while($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
			$ans = $ans . ", " . update_to_string(get_object_latest_update($row["id"]));
		}
	}
	$ans = $ans . " ]";
	return $ans;
}

function get_object_latest_update($object_id) {
	$query = "SELECT * FROM object_updates WHERE object_id = $object_id ORDER BY time DESC";
	$res = mysql_query($query);
	return mysql_fetch_array($res, MYSQL_ASSOC);
}

function update_to_string($row) {
	$ans = "[ $row[object_id], '$row[value]', '$row[style]', $row[position_x], $row[position_y], $row[size_x], $row[size_y] ]";
	return $ans;
}
?>
