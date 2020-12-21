#! /bin/bash
cd '/media/andrey/F/backups/tv/2020/Первый/Юл Бринер';
rm -f 01_ПЕРВЫЙ_КАНАЛ-12192020-0111-out.avi;
ffmpeg -i 01_ПЕРВЫЙ_КАНАЛ-12192020-0111.mts -c:v libx264 -threads 3 -pix_fmt yuv420p 01_ПЕРВЫЙ_КАНАЛ-12192020-0111-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/01_ПЕРВЫЙ_КАНАЛ-12192020-0111-out.avi.log 2>&1 
