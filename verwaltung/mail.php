<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$message = $data['message'];
$mail = $data['address'];
$subject = $data['subject'];
$header = 'From: '.$sender_mail_address.' '. "\r\n" .'Reply-To: '.$sender_mail_address;
$test = $mysql->query("SELECT * FROM mails WHERE fk_stelle_id=$id AND mailing_time IS NOT NULL;");
if($test->num_rows==0) {
  $mailing = mail($mail, $subject, $message, $header);
  if($mailing) {
    $mysql->query("UPDATE mails SET mailing='$message', mailing_time=NOW() WHERE fk_stelle_id=$id;");
    echo "Mail versendet!";
  }
  else {
    echo "Es ist ein Problem aufgetreten.";
  }
}
else {
  echo "Es wurde schon eine Mail versendet. Aus Sicherheitsgründen bitte manuell über das Konto versenden.";
}

?>
