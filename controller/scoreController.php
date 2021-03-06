<?php
print_r($_POST);
if (!empty($_POST['name'])) {
	$_POST['name'] = trim($_POST['name']);
	$json = @file_get_contents('../assets/json/ranking.json');
	if ($json != null) {
		$json = json_decode($json, true);
		$exists = false;
		foreach ($json as $key => $score) {
			if ($score['name'] == $_POST['name']) {
				if ($score['score'] < $_POST['score']) {
					$json[$key]['score'] = $_POST['score'];
					$json[$key]['time'] = $_POST['time'];
				}
				$exists = true;
				continue;
			}
		}

		if (!$exists) {
			$json[] = $_POST;
		}

		uasort($json, "sortRankingByScore");
		$json = array_values($json);
	} else {
		$json[] = $_POST;
	}
	file_put_contents('../assets/json/ranking.json', json_encode($json));
}

function sortRankingByScore($a, $b) {
	if($a['score'] < $b['score']) {
		return 1;
	} else if($a['score'] > $b['score']) {
		return -1;
	} else {
		return 0;
	}
}
?>