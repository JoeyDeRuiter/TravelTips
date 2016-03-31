<?php

/**
* Landen class, om land data uit te lezen
*/
class rand {

	// Public function
	// return random string on length
	public static function string($length) {
		return substr(str_shuffle(md5(time())), $length);
	}
	
	// Public function
	// return random int on length
	public static function int($min, $max) {
		return rand($min, $max);
	}
}