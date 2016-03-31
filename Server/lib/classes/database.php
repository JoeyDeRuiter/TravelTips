<?php

/**
* Database class, access MySQL database
*/
class database extends mysqli
{
	private $db_hostname = "localhost";
	private $db_username = "ap24-17";
	private $db_password = "jnyJMe";
	private $db_database = "dbap24-17";

	function __construct() {
		return parent::__construct($this->db_hostname, $this->db_username, $this->db_password, $this->db_database);
	}
}
