<?php
include("../php/config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

define ('SITE_ROOT', realpath(dirname(__FILE__)));
$i=0;
$j=0;
$bereinigt=array();
$query = $mysql->query("SELECT id, Bild FROM stellen WHERE declined=0;");
while($s=$query->fetch_assoc()) {
  ++$i;
  $url = "/var/www/virtual/kaktus/html/upload/".$s['Bild'];
  echo $url."\n";
  if(file_exists($url))
  {
    $bereinigt[(string)$s['id']] = $s['Bild'];
    ++$j;
  }
}
print_r($bereinigt);
echo "Gesamt: $i, Nicht gefunden: $j";
?>
