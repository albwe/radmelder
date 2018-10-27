<?php
include("config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
$lat = $data['lat']!='' ? $data['lat'] : "NULL";
$lng = $data['lng']!='' ? $data['lng'] : "NULL";
$Titel = $data['Titel']!='' ? "'".$data['Titel']."'" : "NULL";
//$Sachverhalt = $data['Sachverhalt']!='' ? "'".$data['Sachverhalt']."'" : "NULL";
$Problem = $data['Problem']!='' ? "'".$data['Problem']."'" : "NULL";
$Loesung = $data['Loesung']!='' ? "'".$data['Loesung']."'" : "NULL";
//$Bild = $data['Bild']!='' ? "'".$data['Bild']."'" : "NULL";
$Mail = $data['mail']!='' ? "'".$data['mail']."'" : "NULL";
$position_text = $data['position_text']!='' ? "'".$data['position_text']."'" : "NULL";
$query=$mysql->query("INSERT INTO stellen (lat, lng, position_text, Titel, Problem, Loesung, Status) VALUES ($lat, $lng, $position_text, $Titel, $Problem, $Loesung, 'Eingereicht')");
$id = $mysql->insert_id;
$mysql->query("INSERT INTO mails (fk_stelle_id, mail) VALUES ($id, $Mail);");
if($data['BildURI']!="") {
  $DataUriRaw = $data['BildURI'];
  $DataUriSep = explode(',', $DataUriRaw);
  $DataImage = base64_decode($DataUriSep[1]);
  $filename = $id."-".date("YmdHis").".jpg";
  $filepath = $images_folder.'/'.$filename;
  file_put_contents($filepath,$DataImage);
  $mysql->query("UPDATE stellen SET Bild='$filename' WHERE id=$id;");
}
?>
