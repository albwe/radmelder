<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

$mysql->query("DELETE FROM tags WHERE id=$id;");

?>
