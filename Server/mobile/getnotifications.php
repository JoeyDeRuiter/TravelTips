<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];


// User has log in data
if(isset($uuid) && isset($key)) {

	// Check if login key is valid
	if(user::validKey($uuid, $key)) {
		$usr = new user();
		echo json_encode(["status" => true, "notifications" => user::readNotification($usr->IDfromKey($uuid, $key))]);
		exit; // Exit the script because we're done here
	}
		
}
