<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");
$result=array();
$markers=array();

$query= $mysql->query("SELECT stellen.*, mails.mail, mails.mailing, mails.mailing_time, service.service_note FROM stellen LEFT JOIN mails ON stellen.id = mails.fk_stelle_id LEFT JOIN service ON stellen.id=service.fk_stelle");
$i=0;
while($t=$query->fetch_assoc()) {
  $markers[$i]=$t;
  ++$i;
}
$result['markers']=$markers;
echo json_encode($result);
?>
