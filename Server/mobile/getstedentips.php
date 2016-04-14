<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$stadnaam = $_POST['naam'];
$land_id = $_POST['land'];

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

if(isset($stadnaam) && isset($land_id)) {

	if(!is_numeric($land_id))
		return;

	// User has log in data
	if(isset($uuid) && isset($key)) {

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {
			echo json_encode(["status" => true, "tips" => landen::getStedenTips($stadnaam, $land_id)]);
			exit; // Exit the script because we're done here
		}
		
	}

	// User is logged out / Invalid login data
	echo json_encode(["status" => false, "tips" => landen::getStedenTips($stadnaam, $land_id)]);
	
}