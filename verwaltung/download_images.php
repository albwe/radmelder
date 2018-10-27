<?php
require('../php/config.php');
//ini_set('display_errors', 0);
//$mysql = new mysqli($host, $user, $password, $database);
//$mysql->set_charset("utf8");

$data = json_decode(file_get_contents('php://input'), true);
/* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {
	//if the zip file already exists and overwrite is false, return false
	if(file_exists($destination) && !$overwrite) { return [false, "Datei existiert"]; }
	//vars
	$valid_files = array();
	//if files were passed in...
	if(is_array($files)) {
		//cycle through each file
		foreach($files as $file) {
			//make sure the file exists
			if(file_exists($file) && !is_dir($file)) {
				$valid_files[] = $file;
			}
		}
	}
	//if we have good files...
	if(count($valid_files)) {
    //var_dump($valid_files);
		//create the archive
		$zip = new ZipArchive();
		if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
      return [false, "ZIP-Production failed"];
		}
		//add the files
		foreach($valid_files as $file) {
      $new_file_name = end(explode('/', $file));
			$zip->addFile($file,$new_file_name);
		}
		//debug echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

		//close the zip -- done!
		$zip->close();

		//check to make sure the file exists
    $fe = file_exists($destination);
		return [$fe, $fe?"":"Fehler beim ZIP-Speichern"];
	}
	else
	{
		return [false, "Keine valid files"];
	}
}

$down_files = [];
foreach($data['files'] as $f) {
  if($f && $f!="") {
    $down_files[] = $images_folder."/".$f;
  }
}
$date = new DateTime();
$date_string = date_format($date, "Ymd-His");
$dest="image_download/radmelder_img_$date_string.zip";
//var_dump([$down_files, $dest]);
$result_zip = create_zip($down_files, $dest);
$result = array();
$result["success"]=$result_zip[0];
$result["file_name"]=$dest;
$result["error"]=$result_zip[0]? "":$result_zip[1];
echo json_encode($result);
 ?>
