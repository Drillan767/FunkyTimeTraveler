<?php
session_start();
if (!empty($_POST['sound']) && ($_POST['sound'] == 'on' || $_POST['sound'] == 'off')) {
	$_SESSION['sound'] = $_POST['sound'];
}
?>