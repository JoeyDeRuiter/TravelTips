<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$keyword = $_POST['keyword'];

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

// TODO: Check for login

if(isset($keyword)) {

	// User has log in data
	if(isset($uuid) && isset($key)) {

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {
			echo json_encode(["status" => true, "tips" => landen::getTipsOnKeywords(0, 5,$keyword)]);
			exit; // Exit the script because we're done here
		}
		
	}

	// User is logged out / Invalid login data
	//echo json_encode(["status" => false, "landen" => landen::getLanden($start, $limit)]);
	echo json_encode(["status" => false, "tips" => landen::getTipsOnKeywords(0, 5, $keyword)]);
	
}