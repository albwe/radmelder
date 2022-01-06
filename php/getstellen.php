<?php
include("config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");
$result=array();
$markers=array();

$query= $mysql->query("SELECT stellen.*, b.supported FROM stellen LEFT JOIN (SELECT fk_stelle AS id, COUNT(*) AS supported FROM votes GROUP BY fk_stelle ORDER BY supported DESC) AS b ON b.id=stellen.id WHERE stellen.published=1 AND stellen.declined=0 ORDER BY b.supported DESC;");
$numberOfMarkers = $query->num_rows;
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
$result['markers']=$markers;
$result['numberOfMarkers']=$numberOfMarkers;
echo json_encode($result);
?>
