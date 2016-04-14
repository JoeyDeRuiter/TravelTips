<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$tip_id = $_POST['tip_id'];

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

if(isset($tip_id)) {

	if(!is_numeric($tip_id))
		return;

	// User has log in data
	if(isset($uuid) && isset($key)) {

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {
			echo json_encode(["status" => true, "tip" => landen::getLandenTip($tip_id)]);
			exit; // Exit the script because we're done here
		}
		
	}

	// User is logged out / Invalid login data
	echo json_encode(["status" => false, "tip" => landen::getLandenTip($tip_id)]);
	
}