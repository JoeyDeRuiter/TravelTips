<?php
header('Access-Control-Allow-Origin: *'); 
require 'lib/include.php';

// Get string
$string = $_GET['q'];


if($_POST['submit']) {

	$errors = [];

	$secret = $_POST['secret'];
	$password1 = $_POST['password1'];
	$password2 = $_POST['password2'];


	if(strlen($password1) < 6)
		$errors[] = ["error" => "Het wachtwoord is te kort"];

	if(!preg_match('/[0-9]/', $password1))
		$errors[] = ["error" => "Het wachtwoord heeft geen cijfer"];

	if(empty($password1) && empty($password2))
		$errors[] = ["error" => "Er is geen wachtwoord ingevoerd"];

	if($password1 != $password2)
		$errors[] = ["error" => "De wachtwoorden komen niet overeen"];
	

	if(count($errors) == 0) {
		// No errors
		if($password1 === $password2) {
			if(user::setPassword($secret, $password1)) {
				echo "Het wachtwoord is geupdate";
			}
		}
	} else {
		// Print the errors
		foreach($errors as $key => $value) {
			echo $value["error"] . "</br>";
		}
	}

}

?>

<!DOCTYPE html>
<html>
<head>
	<title>Wachtwoord reset</title>
</head>
<body>
<form action="#" method="POST">
<table>
	<input type="hidden" name="secret" value="<?= $string ?>">
	<tr>
		<td>Nieuw wachtwoord: </td>
		<td><input type="password" name="password1"></td>
	</tr>
	<tr>
		<td>Nieuw wachtwoord 2e keer: </td>
		<td><input type="password" name="password2"></td>
	</tr>
	<tr>
		<td><input type="submit" name="submit" value="Verander"></td>
	</tr>
</table>
	
</form>

</body>
</html>