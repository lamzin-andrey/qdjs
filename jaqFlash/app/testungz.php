<?php
$compress = file_get_contents(__DIR__ . '/0.swf.gz');
$decom = gzuncompress($compress);
file_put_contents(__DIR__ . '/1.php.swf', $decom);
