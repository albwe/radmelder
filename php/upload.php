<?php
print_r($_FILES);
/* Getting file name */
//$filename = $_FILES['file']['name'];
$filename = $_POST['filename'];
/* Location */
$location = '/img/';

define ('SITE_ROOT', realpath(dirname(__FILE__)));
//$save_name = $_SERVER['DOCUMENT_ROOT'].'/upload/'.$filename;
//echo $save_name;

/* Upload file */
move_uploaded_file($_FILES['file']['tmp_name'],$_SERVER['DOCUMENT_ROOT'].'/upload/'.$filename);

?>
