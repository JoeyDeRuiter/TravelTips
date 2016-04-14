<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$tip_id = $_POST['tip_id'];
$value = $_POST['value'];

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

if(isset($tip_id)) {

	if(!is_numeric($tip_id))
		return;

	if(!is_numeric($value))
		return;

	// User has log in data
	if(isset($uuid) && isset($key)) {

		$usr = new user();
			user::makeNotification($usr->IDfromKey($uuid, $key), "U heeft net een stad tip met " . $value . " sterren beoordeeld.");

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {
			echo json_encode(["status" => true, "succes" => landen::rateStad($tip_id, $value, $uuid, $key)]);
			exit; // Exit the script because we're done here
		}		
	}
}