#! /bin/bash
cd '/media/andrey/Transcend/HBPVR';
rm -f 01_ПЕРВЫЙ_КАНАЛ-01092021-0042-out.avi;
ffmpeg -i 01_ПЕРВЫЙ_КАНАЛ-01092021-0042.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 01_ПЕРВЫЙ_КАНАЛ-01092021-0042-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/01_ПЕРВЫЙ_КАНАЛ-01092021-0042-out.avi.log 2>&1 
