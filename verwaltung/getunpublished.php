<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");
$result=array();
$markers=array();

$query= $mysql->query("SELECT stellen.*, mails.mail, mails.mailing, mails.mailing_time, service.service_note, b.voted FROM stellen LEFT JOIN mails ON stellen.id = mails.fk_stelle_id LEFT JOIN service ON stellen.id=service.fk_stelle LEFT JOIN (SELECT fk_stelle AS id, COUNT(*) AS voted FROM votes GROUP BY fk_stelle ORDER BY voted DESC) AS b ON b.id=stellen.id");
$i=0;
while($t=$query->fetch_assoc()) {
  $tagq = $mysql->query("SELECT * FROM tags WHERE fk_stelle=".$t['id'].";");
  $tags = array();
  $j=0;
  while($tg=$tagq->fetch_assoc()) {
    $tags[$j]=$tg;
    ++$j;
  }
  $t['tags']=$tags;
  $markers[$i]=$t;
  ++$i;
}
$tag_names = array();
$tagnameq = $mysql->query("SELECT tag_name FROM tags GROUP BY tag_name;");
$k=0;
while($tgn=$tagnameq->fetch_assoc()) {
  $tag_names[$k]=$tgn['tag_name'];
  ++$k;
}
$result['markers']=$markers;
$result['tag_names']=$tag_names;
echo json_encode($result);
?>
