<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';


$title = $_POST['title'];
$post = $_POST['post'];
$land = $_POST['land'];
$toggle = $_POST['toggle'] ? $_POST['toggle'] : false;
$stad = $_POST['stadnaam'] ? $_POST['stadnaam'] : "";

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

// TODO: Check for login

if(isset($title) && isset($post) && isset($land)) {

	if(!is_numeric($land))
		return;

	// User has log in data
	if(isset($uuid) && isset($key)) {

		// Check if login key is valid
		if(user::validKey($uuid, $key)) {

			$usr = new user();
			user::makeNotification($usr->IDfromKey($uuid, $key), "U heeft net een nieuwe tip aangemaakt.");
			
			echo json_encode(["status" => true, "succes" => landen::makeTip($uuid, $key, $title, $post, $land, $toggle, $stad)]);
		}
		
	}
}