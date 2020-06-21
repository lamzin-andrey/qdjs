#! /bin/bash
cd '/media/andrey/D/storage/blackAMD/win/D/tv/2016/05';
rm -f 02_РОССИЯ-1-05092016-2241-out.avi;
ffmpeg -i 02_РОССИЯ-1-05092016-2241.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 02_РОССИЯ-1-05092016-2241-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/02_РОССИЯ-1-05092016-2241-out.avi.log 2>&1 
