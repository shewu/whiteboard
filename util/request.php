<?php
function get_updates() {
	$whiteboard_id = $_GET["whiteboard_id"];
	$connection_id = $_GET["connection_id"];
}

function update_object() {
	
}

switch($_GET["action"]) {
	case "get_object":
		echo get_object();
		break;
	case "update_object":
		update_object();
		break;
}
?>
