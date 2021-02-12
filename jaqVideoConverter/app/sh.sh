#! /bin/bash
cd '/media/andrey/Transcend/HBPVR';
rm -f 10_ТВ_Центр-01102021-0001-out.avi;
ffmpeg -i 10_ТВ_Центр-01102021-0001.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 10_ТВ_Центр-01102021-0001-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/10_ТВ_Центр-01102021-0001-out.avi.log 2>&1 
