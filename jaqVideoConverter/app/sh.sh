#! /bin/bash
cd '/home/andrey/Видео';
rm -f park-out.avi;
ffmpeg -i park.mp4 -c:v libx264 -threads 3 -pix_fmt yuv420p park-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/park-out.avi.log 2>&1 
