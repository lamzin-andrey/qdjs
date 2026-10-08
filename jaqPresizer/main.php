<?php
define('Q_ROOT', '/opt/lampp/htdocs/mh.loc/www/q/q');
require_once Q_ROOT . '/utils.php';

function main() { 
	$srcDir = '/media/andrey/D/storage/blackAMD/win/D/backups/family/photography/2020/08/park';
	$destDir = '/media/andrey/D/storage/blackAMD/win/D/backups/family/photography/2020/08/park/tv';
	
	$ls = scandir($srcDir);
	foreach ($ls as $file) {
		if ($file == '.' || $file == '..') {
			continue;
		}
		$pathInfo = pathinfo($file);
		$ext = $pathInfo['extension'] ?? '';
		if ($ext != 'jpg') {
			continue;
		}
		
		$srcFile = $srcDir . '/' . $file;
		$destFile = $destDir . '/' . $file;
		echo "\nprocess {$file}\n\n";
		utils_resizeAndAddBg($srcFile, $destFile, 679, 1280, [0, 0, 0], false); 
	}
}

main();
