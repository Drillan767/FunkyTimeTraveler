<?php
$pages = array('menu', 'game', 'rules', 'ranking');
if (isset($_GET['page']) && $_GET['page'] != '' || isset($_GET['error'])) {
	if (in_array($_GET['page'], $pages)) {
		$page = $_GET['page'];
		$page_name = getPageName($page).' | ';
	} else {
		require_once('errors.php');
		exit();
	}
} else {
	$page ='menu';
}

function getPageName($page) {
	switch ($page) {
		case 'game':
			return 'Jeux';
			break;
		case 'rules':
			return 'Règles';
			break;
		case 'ranking':
			return 'Classement';
			break;
		default:
			return '';
			break;
	}
}
?>