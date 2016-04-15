<?php
header('Access-Control-Allow-Origin: *'); 
require 'lib/include.php';

// Get string
$string = $_GET['q'];

// Activate account
if(user::activateAccount($string)) {
	echo "Account geactiveerd";
}