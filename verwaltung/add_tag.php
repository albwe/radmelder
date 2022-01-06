<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$tag_value = "'".$data['tag_value']."'";
$tag_name = $data['tag_name']==""? "NULL" : "'".$data['tag_name']."'";
$mysql->query("INSERT INTO tags (fk_stelle, tag_name, tag_value) VALUES ($id, $tag_name, $tag_value);");
?>
