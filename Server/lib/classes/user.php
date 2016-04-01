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
	public function validKey($uuid, $key) {
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

	// Check if account is activated
	public static function accountStatus($user_id) {
		$mysqli = new database();

		if(empty($user_id)){
			echo "ERROR: No user_id is filled in";
			return false;
		}

		// TODO: Maak DB aan en query
		if($stmt = $mysqli->prepare("SELECT `status` FROM `` WHERE `user_id` = ?")) {
			$stmt->bind_param('s', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_status);

			if($stmt->num_rows > 0) {
				$stmt->fetch();

				return $db_status;
			}
		}

		return false;
	}

	// Get the username to linked tot he user id
	public static function accountUsername($user_id) {
		$mysqli = new database;

		if(empty($user_id)){
			echo "ERROR: No user_id is filled in";
			return;
		}

		if($stmt = $mysqli->prepare("SELECT `username` FROM `users` WHERE `ID` = ?")) {
			$stmt->bind_param('s', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_username);

			if($stmt->num_rows > 0) {
				$stmt->fetch();

				return $db_username;
			}
		}
	}

}