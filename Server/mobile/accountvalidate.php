<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

// Check if there is user data
$uuid = $_POST['uuid'];
$key = $_POST['key'];

// TODO: Check for login

if(isset($uuid) && isset($key)) {
	$user = new user();
	echo json_encode(["status" => $user->accountStatus($user->IDfromKey($uuid, $key))]);
} else {
	echo json_encode(["status" => false]);
}