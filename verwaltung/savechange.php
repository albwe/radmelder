<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$lat = $data['lat']!='' ? $data['lat'] : "NULL";
$lng = $data['lng']!='' ? $data['lng'] : "NULL";
$Titel = $data['Titel']!='' ? "'".$data['Titel']."'" : "NULL";
//$Sachverhalt = $data['Sachverhalt']!='' ? "'".$data['Sachverhalt']."'" : "NULL";
$Problem = $data['Problem']!='' ? "'".$data['Problem']."'" : "NULL";
$Kategorie = $data['Kategorie']!='' ? "'".$data['Kategorie']."'" : "NULL";
$Bild = $data['Bild']!='' ? "'".$data['Bild']."'" : "NULL";
$Service_Note = $data['service_note']!='' ? "'".$data['service_note']."'" : "NULL";
$query_text = "UPDATE stellen SET lat=$lat, lng=$lng, Titel=$Titel, Problem=$Problem, Kategorie=$Kategorie, Bild=$Bild WHERE id=$id;";
//echo $query_text;
$query = $mysql->query($query_text);
$query2 = $mysql->query("UPDATE service SET service_note=$Service_Note WHERE fk_stelle=$id");
if ($mysql->affected_rows==0) {
  $mysql->query("INSERT INTO service (fk_stelle, service_note) VALUES ($id, $Service_Note);");
}
$result = array();
if ($query) {
  $result['success']=1;
}
echo json_encode($result);
?>
