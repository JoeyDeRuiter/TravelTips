<?php

function __autoload($classname) {
    $filename = "classes/". $classname .".php";
    include_once($filename);
}