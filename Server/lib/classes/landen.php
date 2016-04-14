<?php

/**
* Landen class, om land data uit te lezen
*/
class landen {
	
	public static function getLanden($start, $limit) {
		$mysqli = new database();

		$landen = [];

		if($stmt = $mysqli->prepare("SELECT `id`, `landNaam`,(SELECT COUNT(*) FROM `landen_tips` WHERE `land_id` = landen.id) AS `Count` FROM `landen` WHERE `Taal` = 'NL' ORDER BY `Count` DESC LIMIT ?, ?")) {
			$stmt->bind_param("ii", $start, $limit);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_landnaam, $db_tips);

			if($stmt->num_rows >= 1) {
				while($stmt->fetch()) {
					$landen[] = ["id" => $db_id, "landnaam" => $db_landnaam, "tips" => $db_tips];
				}
			}
		}

		return $landen;
	}


	public static function getLandOnID($id) {
		$mysqli = new database();

		if(!is_numeric($id))
			return;

		if($stmt = $mysqli->prepare("SELECT `landNaam` FROM `landen` WHERE `Taal` = 'NL' AND `id` = ?")) {
			$stmt->bind_param("i", $id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_landnaam);
			$stmt->fetch();
			return $db_landnaam;
		}
	}

	public static function getSteden($start, $limit, $land_id) {
		$mysqli = new database();

		$steden = [];

		if($stmt = $mysqli->prepare("SELECT DISTINCT(`stadnaam`) as stadname, (SELECT COUNT(*) FROM `steden_tips` WHERE `stadnaam` = stadname AND `land_id` = ?) AS `tips` FROM `steden_tips` WHERE `land_id` = ? ORDER BY `tips` DESC LIMIT ?, ?")) {
			$stmt->bind_param("iiii", $land_id, $land_id, $start, $limit);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_stadnaam, $db_tips);

			if($stmt->num_rows >= 1) {
				while($stmt->fetch()) {
					$steden[] = ["stadnaam" => $db_stadnaam, "tips" => $db_tips];
				}
			}
		}

		return $steden;
	}

	public static function getStedenTips($naam, $land_id) {
		$mysqli = new database;

		$tips = [];

		if($stmt = $mysqli->prepare("SELECT `ID`, `poster_id`, `title`, `post`, (SELECT AVG(`rating`) FROM `steden_tips_rating` WHERE tips_id = `steden_tips`.ID) as `rating` FROM `steden_tips` WHERE `land_id` = ? AND `stadnaam` = ? ORDER BY `rating` DESC")) {
			$stmt->bind_param("is", $land_id, $naam);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_poster_id, $db_title, $db_post, $db_avg_rating);

			if($stmt->num_rows >= 1) {
				while($stmt->fetch()) {
					$tips[] = ["id" => $db_id,  "poster" => user::accountUsername($db_poster_id), "title" => $db_title, "post" => $db_post, "rating" => $db_avg_rating];
				}
			}
		}

		return $tips;
	}

	// Get landen tips
	public static function getLandenTips($start, $limit, $land_id) {
		$mysqli = new database;

		$tips = [];

		if($stmt = $mysqli->prepare("SELECT `ID`, `poster_id`, `title`, `post`, (SELECT AVG(rating) FROM `landen_tips_rating` WHERE `tips_id` = landen_tips.ID) AS `avg_rating` FROM `landen_tips` WHERE `land_id` = ? ORDER BY `avg_rating` DESC LIMIT ?, ?")) {
			$stmt->bind_param("iii", $land_id, $start, $limit);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_poster_id, $db_title, $db_post, $db_avg_rating);

			if($stmt->num_rows >= 1) {
				while($stmt->fetch()) {
					$tips[] = ["id" => $db_id,  "poster" => user::accountUsername($db_poster_id), "title" => $db_title, "post" => $db_post, "rating" => $db_avg_rating];
				}
			}
		}

		return $tips;
	}


	// Get landen tip
	public static function getLandenTip($tip_id) {
		$mysqli = new database;

		if(!isset($tip_id) || empty($tip_id))
			return;

		if(!is_numeric($tip_id))
			return;

		if($stmt = $mysqli->prepare("SELECT `ID`, `poster_id`, `title`, `post`, (SELECT AVG(rating) FROM `landen_tips_rating` WHERE `tips_id` = landen_tips.ID) AS `avg_rating` FROM `landen_tips` WHERE `ID` = ?")) {
			$stmt->bind_param("i", $tip_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_poster_id, $db_title, $db_post, $db_avg_rating);

			if($stmt->fetch()) {
				return ["id" => $db_id, "poster" => user::accountUsername($db_poster_id), "title" => $db_title, "post" => $db_post, "rating" => $db_avg_rating];
			}
		}
	}


	// Rate landen
	public static function rateLand($tip_id, $value, $uuid, $key) {
		$mysqli = new database;

		if(!isset($tip_id) || empty($tip_id))
			return;

		if(!isset($value) || empty($value))
			return;

		if($stmt = $mysqli->prepare("INSERT INTO `landen_tips_rating`(`ID`, `tips_id`, `rating`, `user_id`) VALUES (null, ?, ?, ?)")) {

			$user = new user();
			$user_id = $user->IDfromKey($uuid, $key);
			$value = $value * 10;

			$stmt->bind_param("iii", $tip_id, $value, $user_id);

			if($stmt->execute()) {
				return true;
			}
			
			return false;
		}

	}

	// Rate landen
	public static function rateStad($tip_id, $value, $uuid, $key) {
		$mysqli = new database;

		if(!isset($tip_id) || empty($tip_id))
			return;

		if(!isset($value) || empty($value))
			return;

		if($stmt = $mysqli->prepare("INSERT INTO `steden_tips_rating`(`ID`, `tips_id`, `rating`, `user_id`) VALUES (null, ?, ?, ?)")) {

			$user = new user();
			$user_id = $user->IDfromKey($uuid, $key);
			$value = $value * 10;

			$stmt->bind_param("iii", $tip_id, $value, $user_id);

			if($stmt->execute()) {
				return true;
			}
			
			return false;
		}

	}


	public static function makeTip($uuid, $key, $title, $post, $land, $toggle = false, $stad = "") {
		$mysqli = new database;

		if(!isset($uuid) || empty($uuid))
			return false;

		if(!isset($key) || empty($key))
			return false;

		if(!isset($title) || empty($title))
			return false;

		if(!isset($post) || empty($post))
			return false;

		if(!isset($land) || empty($land))
			return false;


		if($toggle === "false") { // Maak tip alleen voor landen

			if($stmt = $mysqli->prepare("INSERT INTO `landen_tips`(`ID`, `land_id`, `poster_id`, `title`, `post`) VALUES (null, ?, ?, ?, ?)")) {

				$user = new user();
				$u¡ser_id = $user->IDfromKey($uuid, $key);
				$stmt->bind_param("iiss", $land, $user_id, $title, $post);

				if($stmt->execute()) {
					return true;
				}
				
				return false;
			}

		} else { // Maak tip met steden
			if($stmt = $mysqli->prepare("SELECT `ID`, `land_id`, `poster_id`, `title`, `post`, (null) as `stadnaam` FROM `landen_tips` UNION SELECT `ID`, `land_id`, `poster_id`, `title`, `post`, `stadnaam` FROM `steden_tips`")) {

				$user = new user();
				$user_id = $user->IDfromKey($uuid, $key); // Get the user id from the db
				$stad = strtolower($stad); // Force the stad to lower keys
				$stmt->bind_param("iisss", $land, $user_id, $title, $post, $stad);

				if($stmt->execute()) {
					return true;
				}
				
				return false;
			}
		}
	}

	public static function getTipsOnKeywords($start, $limit, $keyword) {
		$mysqli = new database;

		$tips = [];

		if($stmt = $mysqli->prepare("SELECT `ID`, `land_id`, `poster_id`, `title`, `post`, (null) as `stadnaam`, (SELECT AVG(rating) FROM `landen_tips_rating` WHERE `tips_id` = landen_tips.ID) as `rating` FROM `landen_tips` WHERE `post` LIKE ? UNION SELECT `ID`, `land_id`, `poster_id`, `title`, `post`, `stadnaam`, (SELECT AVG(rating) FROM `steden_tips_rating` WHERE `tips_id` = steden_tips.ID) as `rating` FROM `steden_tips` WHERE `post` LIKE ? ORDER BY `rating` DESC LIMIT ?, ?")) {

			$keyword = "%" . $keyword . "%";

			$stmt->bind_param('ssii', $keyword, $keyword, $start, $limit); 
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_id, $db_land_id, $db_poster_id, $db_title, $db_post, $db_stadnaam, $db_rating);

			while($stmt->fetch()) {
				$tips[] = ["id" => $db_id, "land" => landen::getLandOnID($db_land_id), "title" => $db_title, "post" => $db_post, "stadnaam" => $db_stadnaam, "rating" => $db_rating];
			}
			return $tips;
		}
	}
}