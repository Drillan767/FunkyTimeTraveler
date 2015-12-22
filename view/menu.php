<link href="./assets/css/menu.css" type="text/css" rel="stylesheet" media="all"/>
<link href="./assets/css/credits.css" type="text/css" rel="stylesheet" media="all"/>
<div id="menu">
	<img id="flamme" src="./assets/img/flame.gif"/>
	<img id="mute" src="./assets/img/sound_<?php echo $_SESSION['sound']; ?>.png"/>
	<div id="menu-central"> 
		<h1>Funky</h1>
		<h4>Time Traveler</h4>
		<img id="hourglass" src="./assets/img/hourglass.gif"/>
		<nav>
			<ul>
				<li id="play"><a href="?page=game">Commencer à jouer</a></li>
				<li><a href="?page=rules">Comment jouer</a></li>
				<li><a href="?page=ranking">Classements</a></li>
				<li><a href="#creditos" name="creditos">Crédits</a></li>
			</ul>
		</nav>
		<span class="copyright">Copyright G4 LTD. 2015</span>
	</div>
	<img id="flamme2" src="./assets/img/flame.gif"/>
	<p id="version">v<?php echo VERSION; ?></p>
	<audio preload="auto" loop autoplay>
		<source src="./assets/audio/main.mp3" type="audio/mpeg">
		<source src="./assets/audio/main.ogg" type="audio/ogg">
	</audio>
</div>

<!-- Credits -->
<div id="titles">
	<div id="credits">
		<div id="the-end">Crédits</div>
		<h1>Projet réalisé par l'équipe 5-stars</h1>
		<dl>
			<dt>Chef de projet</dt>
			<dd>Paul Dialinas</dd>
			<dt>Développeurs</dt>
			<dd>Quentin Pollet</dd>
			<dd>Joseph Levarato</dd>
			<dt>Design / Animation</dt>
			<dd>Paul Dialinas</dd>
			<dd>Alexis Allaoui</dd>
			<dt>Interface et utilisation</dt>
			<dd>Adrien Grange</dd>
			<dd>Jérémy Obrier</dd>
			<dt>Intelligence artificielle</dt>
			<dd>Quentin Pollet</dd>
			<dd>Joseph Levarato</dd>
			<dt>Personnages</dt>
			<dd>Paul Dialinas</dd>
			<dd>Alexis Allaoui</dd>
			<dd>Adrien Grange</dd>
			<dd>Jérémy Obrier</dd>
			<dt>Crédits images/sons</dt>
			<dd>Polices d'écriture : Dafont</dd>
			<dd>Musiques : 8 Bit Universe</dd>
			<dd>Images brutes : DeviantArt</dd>
		</dl>
		<h1>Copyright G4 2015</h1>
		<img src="./assets/img/logocredits.png"/>
		<audio preload="auto" loop>
			<source src="./assets/audio/credits.mp3" type="audio/mpeg"/>
			<source src="./assets/audio/credits.ogg" type="audio/ogg"/>
		</audio>
	</div>
</div>
<script src="./assets/js/main.js" type="text/javascript"></script>
<script src="./assets/js/credits.js" type="text/javascript"></script>