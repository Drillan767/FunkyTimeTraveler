<link href="./assets/css/menu.css" type="text/css" rel="stylesheet" media="all"/>
<div id="title">
	<h1>Classement</h1>
	<?php
	$json = @file_get_contents('./assets/json/ranking.json');
	if ($json != null) {
		$json = json_decode($json, true);
		echo '<ol>';
		foreach ($json as $key => $score) {
			if ($key == 30) {
				break;
			}
			echo '<li>'.$score['name'].' : '.$score['score'].'</li>';
		}
		echo '</ol>';
	} else {
		echo 'Pas de classement disponible';
	}
	?>
	<a href="./" id="backHome">Revenir au menu principal</a>
</div>
