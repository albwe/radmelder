<?php
include("config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");
$result=array();
$markers=array();

$query= $mysql->query("SELECT stellen.*, b.supported FROM stellen LEFT JOIN (SELECT fk_stelle AS id, COUNT(*) AS supported FROM votes GROUP BY fk_stelle ORDER BY supported DESC) AS b ON b.id=stellen.id WHERE stellen.published=1 AND stellen.declined=0 ORDER BY b.supported DESC;");
$i=0;
while($t=$query->fetch_assoc()) {
  $markers[$i]=$t;
  ++$i;
}
$result['markers']=$markers;
echo json_encode($result);
?>
