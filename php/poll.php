<?php
include("config.php");

$mysql = new mysqli($host, $user, $password, $database);
$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);

$result=array();
$query=$mysql->query("SELECT * FROM questions WHERE link='".$data['link']."';");

if($query->num_rows==1) {
    $result['exists']=true;
    while($t = $query->fetch_assoc()) {
        $result['p']=$t;
    }
    if ($result['p']['active']==1){
    $options=$mysql->query("SELECT o.id AS id, o.text AS text, o.created AS created, COUNT( v.fk_option ) AS votes FROM options o LEFT JOIN votes v ON o.id = v.fk_option WHERE o.fk_question = ".$result['p']['id']." GROUP BY o.id");
    $result['p']['options']=array();
    $i=0;
    while($o = $options->fetch_assoc()) {
        $result['p']['options'][$i]=$o;
        ++$i;
    }
    
    }
    else{
        $result['p']['id']="";
    }
}
else {
    $result['exists']=false;
}

echo json_encode($result);
?>