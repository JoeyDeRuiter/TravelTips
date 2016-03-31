<?php
header('Access-Control-Allow-Origin: *'); 

require '../lib/include.php';

$email 		= $_POST['email'];
$username 	= $_POST['username'];
$password 	= $_POST['password'];
$uuid 		= $_POST['uuid'];


if(isset($email) && isset($username) && isset($password) && isset($uuid)) {

	$mysqli = new database();

	// Check if username is already taken
	if(user::usernameExists($username) > 0) {
		echo json_encode(["status" => false, "msg" => "Er bestaat al een account met die gebruikersnaam!"]);
		exit;
	}

	// Check if email is already taken
	if(user::emailExists($email) > 0) {
		echo json_encode(["status" => false, "msg" => "Er bestaat al een account met dat email adres!"]);
		exit;
	}


	// Form validation
	// Email
	if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		echo json_encode(["status" => false, "msg" => "Het email adres is ongeldig!"]);
		exit;
	}

	// Username
	if(!strlen($username) > 3) {
		echo json_encode(["status" => false, "msg" => "De gebruikersnaam is ongeldig!"]);
		exit;
	}

	// Password
	if(!strlen($password) > 6 || !preg_match('#[0-9]#', $password)) {
		echo json_encode(["status" => false, "msg" => "Het wachtwoord is ongeldig!"]);
		exit;
	}


	if($stmt = $mysqli->prepare("INSERT INTO `users`(`ID`, `username`, `password`, `email`) VALUES (null, ?, ?, ?)")) {

		$stmt->bind_param("sss", $username, $password, $email);

		$password = password_hash($password, PASSWORD_DEFAULT);

		if($stmt->execute()) {
			// TODO: Auto logon
		}else{
			echo json_encode(["status" => false, "msg" => "Er ging iets mis! Probeer het later opnieuw"]);
			exit;
		}
	}
}

// EOF