<?php
include("config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

$mysql->query("INSERT INTO votes (fk_stelle) VALUES ($id)");
$query_text = "SELECT COUNT(*) AS supported FROM votes WHERE fk_stelle=$id GROUP BY fk_stelle;";
//echo $query_text;
$query = $mysql->query($query_text);
$result=array();
$result['supported']=$query->fetch_assoc()['supported'];
echo json_encode($result);
?>
