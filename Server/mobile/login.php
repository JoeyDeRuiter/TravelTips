<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$uuid 		= $_POST['uuid'];
$username 	= $_POST['username'];
$password 	= $_POST['password'];


if(isset($uuid) && isset($username) && isset($password)) {
	// Connect with the database
	$mysqli = new database();
	$user = new user();

	// Generate login key
	if($user_id = $user->login($username, $password)) {

		// Check if the user id is an int
		if(!is_int($user_id))
			return;

		list($status, $key) = $user->generateKey($uuid, $user_id);
		$username = $user->accountUsername($user_id);
		echo json_encode(["status" => $status, "key" => $key, "username" => $username]);
	}
}
