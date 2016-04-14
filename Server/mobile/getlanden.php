<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$start = $_POST['start'];
$limit = $_POST['limit'];


// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

// TODO: Check for login

if(isset($start) && isset($limit)) {

	if(!is_numeric($start))
		return;

	if(!is_numeric($limit))
		return;

	// User has log in data
	if(isset($uuid) && isset($key)) {

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {
			echo json_encode(["status" => true, "landen" => landen::getLanden($start, $limit)]);
			exit; // Exit the script because we're done here
		}
		
	}

	// User is logged out / Invalid login data
	echo json_encode(["status" => false, "landen" => landen::getLanden($start, $limit)]);
	
}