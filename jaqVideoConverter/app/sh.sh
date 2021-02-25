#! /bin/bash
cd '/home/andrey/tmp/00/01';
rm -f 06_РОССИЯ-К-01212021-0830-out.avi;
ffmpeg -i 06_РОССИЯ-К-01212021-0830.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 06_РОССИЯ-К-01212021-0830-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/06_РОССИЯ-К-01212021-0830-out.avi.log 2>&1 
