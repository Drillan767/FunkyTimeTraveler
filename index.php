<?php
require_once('controller/pageController.php');
require_once('config.php');
?>
<!DOCTYPE html>
<html lang="<?php echo $_SESSION['lang']; ?>">
<head>
	<meta charset="utf-8"/>
	<title><?php echo $page_name.SITE_NAME; ?></title>
	<meta name="robots" content="all"/>
	<meta name="author" content="<?php echo AUTHOR; ?>"/>
	<meta name="description" content="<?php echo SITE_NAME; ?>, jouez pour sauver Funky des griffes du temps"/>
	<meta name="keywords" content="<?php echo SITE_NAME; ?>,projet,cercle de projet,Institut G4"/>
	<link rel="icon" type="image/png" href="./assets/img/icon180x180.png"/>
	<link rel="apple-touch-icon-precomposed" href="./assets/img/icon180x180.png"/>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
	<meta name="viewport" content="width=1024, user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="apple-mobile-web-app-title" content="<?php echo SITE_NAME; ?>"/>
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
	<meta name="apple-touch-fullscreen" content="yes"/>
	<meta name="format-detection" content="telephone=yes"/>
	<meta name="HandheldFriendly" content="true"/>
	<?php if (isMobile()) {
		echo '<script type="text/javascript">
			<!-- Pour que les liens restent dans la WebApp -->
			(function(e,t,n)
			{if(n in t&&t[n]){var r,i=e.location,s=/^(a|html)$/i;e.addEventListener("click",function(e){r=e.target;while(!s.test(r.nodeName)){r=r.parentNode}if("href"in r&&(r.href.indexOf("http")||~r.href.indexOf(i.host))){e.preventDefault();i.href=r.href}},false);}}
			)(document,window.navigator,"standalone")
		</script>';
	}?>

	<meta property="og:url" content="http://polletquentin74.fr/projects/G4/FunkyTimeTraveler/"/>
	<meta property="og:title" content="<?php echo SITE_NAME; ?>"/>
	<meta property="og:description" content="<?php echo SITE_NAME; ?>, jouez pour sauver Funky des griffes du temps"/>
	<meta property="og:type" content="website"/>
	<meta property="og:image" content="http://polletquentin74.fr/projects/G4/FunkyTimeTraveler/assets/img/icon180x180.png"/>
	<meta property="og:image:type" content="image/png"/>
	<meta property="og:image:width" content="180"/>
	<meta property="og:image:height" content="180"/>

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
	<script type='text/javascript' id='#GoogleAnalytics'>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-51403350-1', 'auto');
	ga('set', 'forceSSL', true);
	ga('require', 'linkid');
	ga('require', 'displayfeatures');
	ga('send', 'pageview');
</script>
</body>