<?php
header('Access-Control-Allow-Origin: *'); 
require 'lib/include.php';

$string = $_GET['q'];

user::activateAccount($string);