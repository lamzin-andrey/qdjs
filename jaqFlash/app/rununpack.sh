#! /bin/bash
dd if="/home/andrey/hdata/programs/my/qdjs/jaqFlash/app/2012.swf" of="/home/andrey/hdata/programs/my/qdjs/jaqFlash/app/0.swf.gz" skip=8 ibs=1
php /home/andrey/hdata/programs/my/qdjs/jaqFlash/app/testungz.php
