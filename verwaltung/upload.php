<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
if($data['BildURI']!="") {
  $DataUriRaw = $data['BildURI'];
  $DataUriSep = explode(',', $DataUriRaw);
  $DataImage = base64_decode($DataUriSep[1]);
  $filename = $id."-".date("YmdHis").".jpg";
  $filepath = $_SERVER['DOCUMENT_ROOT'].'/upload/'.$filename;
  file_put_contents($filepath,$DataImage);
  $mysql->query("UPDATE stellen SET Bild='$filename' WHERE id=$id;");
}
echo $filename;
?>
