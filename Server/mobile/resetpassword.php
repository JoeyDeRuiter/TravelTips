<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$email = $_POST['email'];

if(isset($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
	echo json_encode(["status" => user::resetPassword(user::IDfromEmail($email))]);
}