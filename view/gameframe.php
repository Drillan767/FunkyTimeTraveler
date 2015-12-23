<!DOCTYPE html>
<?php
session_start();
$hacked = '';
if (isset($_GET['hacked']) && empty($_GET['hacked'])) {
	$hacked = 'data-hacked';
}
?>
<html>
<head>
	<meta charset="UTF-8"/>
	<script src="../assets/js/jQuery.js" type="text/javascript"></script>
	<script src='../assets/js/jquery.timer.js' type="text/javascript"></script>
	<script src='../assets/Quintus/quintus.js'></script>
	<script src='../assets/Quintus/quintus_2d.js'></script>
	<script src='../assets/Quintus/quintus_anim.js'></script>
	<script src='../assets/Quintus/quintus_input.js'></script>
	<script src='../assets/Quintus/quintus_scenes.js'></script>
	<script src='../assets/Quintus/quintus_sprites.js'></script>
	<script src='../assets/Quintus/quintus_touch.js'></script>
	<script src='../assets/Quintus/quintus_ui.js'></script>
	<link rel="stylesheet" type="text/css" href="../assets/css/gameframe.css">
	<script src='../assets/js/platformer.js'></script>
</head>
<body id="gameframe" data-sound="<?php echo $_SESSION['sound']; ?>" <?php echo $hacked; ?>>
	<div id="interface">
		<div id="timer">
			<img id="skull" src="../assets/img/skull.png"/>
			<div id="progress"></div>
			<span class="display">00:00</span>
			<img id="star" src="../assets/img/star.png"/>
		</div>
		<img id="mute" src="../assets/img/sound_<?php echo $_SESSION['sound']; ?>.png"/>
		<div id="score">Score : <span class="display">0</span></div>
		<div id="pause_container">
			<div>
				<p>Pause</p>
				<p>"p" pour continuer</p>
				<p class="info">Niveau : <span id="level_display">0</span><span class="space"></span>Score : <span id="score_display">0</span></p>
				<button>Quitter le jeu</button>
			</div>
		</div>
		<div id="loading_container">
			<div>
				<p>Chargement ...</p>
			</div>
		</div>
	</div>
	<div id="audio_level" class="audio">
		<audio preload="auto" loop id="prehistory_audio">
			<source src="../assets/audio/prehistory.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/prehistory.ogg" type="audio/ogg"/>
		</audio>
		<audio preload="auto" loop id="middle_age_audio">
			<source src="../assets/audio/middle_age.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/middle_age.ogg" type="audio/ogg"/>
		</audio>
		<audio preload="auto" loop id="renaissance_audio">
			<source src="../assets/audio/renaissance.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/renaissance.ogg" type="audio/ogg"/>
		</audio>
		<audio preload="auto" loop id="80s_audio">
			<source src="../assets/audio/80s.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/80s.ogg" type="audio/ogg"/>
		</audio>
		<audio preload="auto" loop id="futur_audio">
			<source src="../assets/audio/futur.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/futur.ogg" type="audio/ogg"/>
		</audio>
	</div>
	<div id="audio_fx" class="audio">
		<audio preload="auto" id="getHit">
			<source src="../assets/audio/fx/getHit.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/fx/getHit.wav" type="audio/wav"/>
		</audio>
		<audio preload="auto" id="hitEnemy">
			<source src="../assets/audio/fx/hitEnemy.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/fx/hitEnemy.wav" type="audio/wav"/>
		</audio>
		<audio preload="auto" id="jump">
			<source src="../assets/audio/fx/jump.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/fx/jump.wav" type="audio/wav"/>
		</audio>
		<audio preload="auto" id="nextLevel">
			<source src="../assets/audio/fx/nextLevel.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/fx/nextLevel.wav" type="audio/wav"/>
		</audio>
		<audio preload="auto" id="loose">
			<source src="../assets/audio/fx/loose.mp3" type="audio/mpeg"/>
			<source src="../assets/audio/fx/loose.wav" type="audio/wav"/>
		</audio>
	</div>
</body>