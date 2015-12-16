<?php
$pages = array('menu', 'game', 'rules', 'ranking');
if (isset($_GET['page']) && $_GET['page'] != '' || isset($_GET['error'])) {
  if (in_array($_GET['page'], $pages)) {
    $page = $_GET['page'];
  } else {
    require_once('errors.php');
    exit();
  }
} else {
  $page ='menu';
}
?>