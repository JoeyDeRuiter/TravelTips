<?php
header('Access-Control-Allow-Origin: *'); 
require 'lib/include.php';

// Get string
$string = $_GET['q'];

// Activate account
user::activateAccount($string);