<?php
require_once('controller/pageController.php');
require_once('config.php');
?>
<!DOCTYPE html>
<html lang="<?php echo $_SESSION['lang']; ?>">
<head>
	<meta charset="utf-8"/>
	<title><?php echo SITE_NAME; ?></title>
	<meta name="robots" content="all"/>
	<meta name="author" content="<?php echo AUTHOR; ?>"/>
	<meta name="description" content="<?php echo SITE_NAME; ?>"/>
	<meta name="keywords" content="<?php echo SITE_NAME; ?>,projet,cercle de projet,Institut G4"/>
	<link rel="icon" type="image/png" href="./assets/img/icon180x180.png"/>
	<link rel="apple-touch-icon-precomposed" href="./assets/img/icon180x180.png"/>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
	<meta name="viewport" content="width=1024, user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="apple-mobile-web-app-title" content="<?php echo SITE_NAME; ?>"/>
	<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
	<meta name="apple-touch-fullscreen" content="yes"/>
	<meta name="format-detection" content="telephone=yes"/>
	<meta name="HandheldFriendly" content="true"/>

	<link href="./assets/css/main.css" type="text/css" rel="stylesheet" media="all"/>

	<!--[if lt IE 9]><script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
	<script src="./assets/js/jQuery.js" type="text/javascript"></script>
</head>
<body id="<?php echo 'page_'.$page; ?>" data-sound="<?php echo $_SESSION['sound']; ?>">
	<div class="container">
		<?php
		require_once('view/'.$page.'.php');
		?>
	</div>
</body>