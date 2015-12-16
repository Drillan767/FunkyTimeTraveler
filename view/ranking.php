<link href="./assets/css/menu.css" type="text/css" rel="stylesheet" media="all"/>
<div id="title">
	<div id="titre-regles"><p>Classement</p></div>
	<?php
	$json = @file_get_contents('./assets/json/ranking.json');
	if ($json != null) {
		$json = json_decode($json, true);
		echo '<ol>';
		foreach ($json as $key => $score) {
			echo '<li>'.$score['name'].' : '.$score['score'].'</li>';
		}
		echo '</ol>';
	} else {
		echo 'Pas de classement disponible';
	}
	?>
	<br/><br/><br/>
	<div><a href="./">Revenir au menu principal</a></div>
</div>
