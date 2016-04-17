<?php

/**
* User class, for login auth and registration
*/
class user {
	// Checks if user is valid
	// Arg: username (string) password (string)
	// Return: account ID (bool)
	public function login($username, $password) {
		$mysqli = new database();

		if(empty($username)){
			echo "ERROR: No USERNAME found";
			return false;
		}

		if(empty($password)){
			echo "ERROR: No PASSWORD found";
			return false;
		}

		if($stmt = $mysqli->prepare("SELECT `ID`, `username`, `password` FROM `users` WHERE `username` = ?")) {
			$stmt->bind_param("s", $username);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_username, $db_password);


			if($stmt->num_rows >= 1) {
				$stmt->fetch();
				
				if(password_verify($password, $db_password) === true) {
					return $db_id;
				}else{
					echo "Geen account gevonden";
				}
			}
		}

		return false;
	}

	// Delete all keys with the same details in db
	// Arg: UUID (string) model (string) user_id (int)
	// Return: Status (bool)
	public function logout($device_uuid, $device_key) {
		$mysqli = new database();

		if(empty($device_uuid)){
			echo "ERROR: No UUID found";
			return false;
		}

		if(empty($device_key)){
			echo "ERROR: No device key found";
			return false;
		}

		if($stmt = $mysqli->prepare("DELETE FROM `devices` WHERE `device_uuid` = ? AND `device_key` = ?")) {
			$stmt->bind_param('ss', $device_uuid, $device_key);

			$device_uuid = hash('sha256', $device_uuid);

			if($stmt->execute()) {
				return true;
			}
		}

		return false;
	}

	// Generate key in db
	// Arg: UUID (string) model (string) user_id (int)
	// Return: User ID
	public function generateKey($device_uuid, $user_id) {
		$mysqli = new database();

		// Check if it is the only key with the current uuid
		// Else delete both

		if(empty($device_uuid)){
			echo "ERROR: No UUID found";
			return false;
		}

		if(empty($user_id) || $user_id == null){
			echo "ERROR: No USER ID found";
			return false;
		}

		if($stmt = $mysqli->prepare("INSERT INTO `devices`(`ID`, `device_uuid`, `device_key`, `user_id`) VALUES (null, ?, ?, ?)")) {
			$stmt->bind_param('ssi', $device_uuid, $device_key, $user_id);

			// Generate data to be stored
			$device_uuid 	= hash('sha256', $device_uuid);
			$device_key 	= rand::string(16);

			// Store data
			if($stmt->execute()) {
				return [true, $device_key];
			}else{
				return [false, null];
			}
		}
	}


	// Checks if the key in the database is valid, and only exists once
	// Arg: UUID (string) model (string) user_id (int)
	// Return: bool
	public static function validKey($uuid, $key) {
		$mysqli = new database();

		if(empty($uuid)) {
			echo "ERROR: No UUID found";
			return false;
		}

		if(empty($key)) {
			echo "ERROR: No KEY found";
			return false;
		}

		if($stmt = $mysqli->prepare("SELECT `ID` FROM `devices` WHERE `device_uuid` = ? AND `device_key` = ?")) {
			$stmt->bind_param('ss', $uuid, $key);

			// Change UUID
			$uuid = hash('sha256', $uuid);

			$stmt->execute();
			$stmt->store_result();
			if($stmt->num_rows > 0) {
				return true;
			}
		}

		return false;
	}


	// Checks if the username exists
	// Arg: username (string)
	// Return: amount of records (int)
	public static function usernameExists($username) { 
		$mysqli = new database();

		if(empty($username)){
			echo "ERROR: No username is filled in";
			return false;
		}

		if($stmt = $mysqli->prepare("SELECT `username` FROM `users` WHERE `username` = ?")) {

			$stmt->bind_param('s', $username);
			$stmt->execute();
			$stmt->store_result();
			return $stmt->num_rows;
		}

		return false;
	}
		
	// Checks if the email exists
	// Arg: email (string)
	// Return: amount of records (int)
	public static function emailExists($mail) {
		$mysqli = new database();

		if(empty($mail)){
			echo "ERROR: No email is filled in";
			return false;
		}

		if($stmt = $mysqli->prepare("SELECT `email` FROM `users` WHERE `email` = ?")) {

			$stmt->bind_param('s', $mail);
			$stmt->execute();
			$stmt->store_result();
			return $stmt->num_rows;
		}

		return false;
	}

	public static function emailFromID($id) {
		$mysqli = new database;

		if(empty($id)) {
			echo "ERROR: No email is filled in";
			return false;
		}

		if($stmt = $mysqli->prepare("SELECT `email` FROM `users` WHERE `ID` = ?")) {
			$stmt->bind_param('i', $id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_email);

			if($stmt->fetch())
				return $db_email;
		}
	}

	// Check if the email exists
	// Arg: email (string)
	// Retur : ID of the user
	public static function IDfromEmail($email) {
		$mysqli = new database;

		if(empty($email)) {
			echo "ERROR: No email is filled in";
			return false;
		}

		if($stmt = $mysqli->prepare("SELECT `ID` FROM `users` WHERE `email` = ?")) {
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_user_id);

			if($stmt->fetch())
				return $db_user_id;
		}
	}
 	
 	// Get the ID from the key
	public function IDfromKey($uuid, $key) {
		$mysqli = new database;

		if(empty($uuid)){
			echo "ERROR: No uuid is filled in";
			return;
		}

		if(empty($key)){
			echo "ERROR: No key is filled in";
			return;
		}

		if($stmt = $mysqli->prepare("SELECT `user_id` FROM `devices` WHERE `device_uuid` = ? AND `device_key` = ?")) {
			// Get current url
			$uuid = hash('sha256', $uuid);

			$stmt->bind_param('ss', $uuid, $key);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_user_id);

			if($stmt->num_rows > 0) {
				$stmt->fetch();
				return $db_user_id;
			}
		}
	}

	public static function activateAccount($string) {
		$mysqli = new database;

		if(empty($string)){
			echo "ERROR: No user_id is filled in";
			return;
		}

		if($stmt = $mysqli->prepare("SELECT `ID`, `user_id` FROM `activationurls` WHERE `rng_string` = ?")) {
			// Get current url
			$stmt->bind_param('s', $string);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_user_id);

			if($stmt->num_rows > 0) {
				$stmt->fetch();

				// Update the account
				if($stmt_change = $mysqli->prepare("UPDATE `users` SET `status`='activated' WHERE `ID` = ?")) {
					$stmt_change->bind_param('i', $db_user_id);
					$stmt_change->execute();
				}

				// Delete the string
				if($stmt_del = $mysqli->prepare("DELETE FROM `activationurls` WHERE `ID` = ?")) {
					$stmt_del->bind_param('i', $db_id);
					$stmt_del->execute();
				}

				return true;
			}
		}
	}

	public static function accountStatus($user_id) {
		$mysqli = new database;

		if(empty($user_id) || !is_numeric($user_id)){
			echo "ERROR: No user_id is filled in";
			return;
		}

		if($stmt = $mysqli->prepare("SELECT `status` FROM `users` WHERE `ID` = ?")) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_status);

			if($stmt->num_rows > 0) {
				$stmt->fetch();

				return $db_status;
			}
		}
	}

	// Get the username to linked to the user id
	public static function accountUsername($user_id) {
		$mysqli = new database;

		if(empty($user_id)){
			echo "ERROR: No user_id is filled in";
			return;
		}

		if($stmt = $mysqli->prepare("SELECT `username` FROM `users` WHERE `ID` = ?")) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_username);

			if($stmt->num_rows > 0) {
				$stmt->fetch();

				return $db_username;
			}
		}
	}

	public static function makeNotification($id, $post) {
		$mysqli = new database;

		if(empty($id))
			return;

		if(empty($post))
			return;

		if($stmt = $mysqli->prepare("INSERT INTO `notification`(`ID`, `user_ID`, `post`) VALUES (null, ?, ?)")) {
			$stmt->bind_param('is', $id, $post);

			if($stmt->execute()) {
				return true;
			} else {
				return false;
			}
		}
	}

	public static function readNotification($id) {
		$mysqli = new database;

		$posts = [];

		if($stmt = $mysqli->prepare("SELECT `post` FROM `notification` WHERE `user_ID` = ? ORDER BY `ID` DESC")) {
			$stmt->bind_param('i', $id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_post);

			while($stmt->fetch()) {
				$posts[] = ["post" => $db_post];
			}

			return $posts;
		}
	}

	public static function resetPassword($id) {
		$mysqli = new database;

		if($stmt = $mysqli->prepare("INSERT INTO `reseturls`(`ID`, `user_id`, `string`) VALUES (null, ?, ?)")) {
			$rng_string = rand::string(0);
			$stmt->bind_param('is', $id, $rng_string);

			if($stmt->execute()) {
				// Send mail

				$email = user::emailFromID($id);
				$subject = "Wachtwoord reset";
				$message = "Wachtwoord reset link: http://ap24-17.ict-lab.nl/reset.php?q=" . $rng_string;
				$header = "From: noreply@traveltips.nl";

				// Send mail
				mail($email, $subject, $message, $header);

				return true;
			}
			
			return false;
		}
	}

	public static function setPassword($string, $new_pass) {
		$mysqli = new database;
		
		$id = "";
		
		$new_pass = password_hash($new_pass, PASSWORD_DEFAULT);
		
		if($stmt = $mysqli->prepare("SELECT `user_id` FROM `reseturls` WHERE `string` = ?")) {
			$stmt->bind_param('s', $string);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_user_id);

			if($stmt->fetch())
				$id = $db_user_id;
		}

		// Update userpassword & delete old string from db
		if($stmt = $mysqli->prepare("UPDATE `users` SET `password`= ? WHERE `ID` = ?")) {
			$stmt->bind_param('si', $new_pass, $id);
			
			if($stmt->execute())
				return true;
		}
		

		return false;
	}
}