<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$query_text = "UPDATE stellen SET declined=1 WHERE id=$id;";
//echo $query_text;
$query = $mysql->query($query_text);
//var_dump($query);
$result = array();
if ($query) {
  $result['success']=1;
}
echo json_encode($result);
?>
