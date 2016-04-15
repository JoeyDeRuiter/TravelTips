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


	if($stmt = $mysqli->prepare("INSERT INTO `users`(`ID`, `username`, `password`, `email`, `status`) VALUES (null, ?, ?, ?, default)")) {

		$stmt->bind_param("sss", $username, $password, $email);

		$password = password_hash($password, PASSWORD_DEFAULT);

		if($stmt->execute()) {

			// Make a actiavtion url and mail it to the email adres
			if($stmt_activation = $mysqli->prepare("INSERT INTO `activationurls`(`ID`, `user_id`, `rng_string`) VALUES (null, ?, ?)")) {

				// Generate mail data
				$user_id = $stmt->insert_id;
				$rng_string = rand::string(0);
				$stmt_activation->bind_param('is', $user_id, $rng_string);

				if($stmt_activation->execute()) {
					// Auto login

					// Activate email
					// Set up mail
					$subject = "Welkom bij Traveltips";
					$message = "Welkom bij Traveltips " . $username . ", activeer uw account op de volgende pagina : http://ap24-17.ict-lab.nl/activate.php?q=" . $rng_string;
					$header = "From: noreply@traveltips.nl";

					// Send mail
					mail($email, $subject, $message, $header);

					echo json_encode(["status" => true, "msg" => "Het account is geregisteerd!"]);

				}else{
					echo $stmt_activation->error;
				}
			}


		}else{
			echo json_encode(["status" => false, "msg" => "Er ging iets mis! Probeer het later opnieuw"]);
			exit;
		}
	}
}

// EOF