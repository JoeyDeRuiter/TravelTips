<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$uuid = $_POST['uuid'];
$key = $_POST['key'];

if(isset($uuid) && isset($key)) {
	$user = new user();
	echo json_encode(["status" => $user->validKey($uuid, $key)]);
}