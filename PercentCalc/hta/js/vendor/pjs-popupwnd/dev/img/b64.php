<?php
$s = file_get_contents(__DIR__ . '/popup-bg.png');
echo base64_encode($s);
