#! /bin/bash
cd '/media/andrey/Transcend/HBPVR';
rm -f 02_РОССИЯ-1-12272020-1808-out.avi;
ffmpeg -i 02_РОССИЯ-1-12272020-1808.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 02_РОССИЯ-1-12272020-1808-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/02_РОССИЯ-1-12272020-1808-out.avi.log 2>&1 
