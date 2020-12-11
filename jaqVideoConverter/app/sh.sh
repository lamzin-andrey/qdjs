#! /bin/bash
cd '/media/andrey/F/backups/tv/2020/Очереди в Америке';
rm -f 10_ТВ_Центр-09152020-1318-out.avi;
ffmpeg -i 10_ТВ_Центр-09152020-1318.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 10_ТВ_Центр-09152020-1318-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/10_ТВ_Центр-09152020-1318-out.avi.log 2>&1 
