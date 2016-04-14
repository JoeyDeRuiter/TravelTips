<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$start = $_POST['start'];
$limit = $_POST['limit'];
$land_id = $_POST['land_id'];

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

if(isset($start) && isset($limit)) {

	if(!is_numeric($start))
		return;

	if(!is_numeric($limit))
		return;

	// User has log in data
	if(isset($uuid) && isset($key)) {

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {
			echo json_encode(["status" => true, "tips" => landen::getLandenTips($start, $limit, $land_id)]);
			exit; // Exit the script because we're done here
		}
		
	}

	// User is logged out / Invalid login data
	echo json_encode(["status" => false, "tips" => landen::getLandenTips($start, $limit, $land_id)]);
	
}