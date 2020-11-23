<?php
include __DIR__ . '/q/custom.php';
include __DIR__ . '/q/mysql.php';
function main() {
	$sqlfile = __DIR__ . '/command.sql';
	if (!file_exists($sqlfile)) {
		$result = ['status' => 'error', 'msg' => 'File command.sql not found!'];
		save($result);
		return;
	}
	$s = trim(file_get_contents($sqlfile), "\x1B");
	global $dberror;
	$rows = query($s, $n, $ar, true);
	if ($dberror) {
		$result = ['status' => 'error', 'msg' => $dberror];
		save($result);
		return;
	}
	$result = [
		'status' => 'ok',
		'rows' => $rows,
		'n' => $n,
		'ar' => $ar
	];
	save($result);
}

function save($arr) {
	$outfile = __DIR__ . '/result.json';
	$r =  json_encode($arr);
	file_put_contents($outfile, $r);
}

main();
