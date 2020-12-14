#! /bin/bash
cd '/media/andrey/123456789/video/Konstantin/2020-11-01';
rm -f VID-20201213-WA0003-out.avi;
ffmpeg -i VID-20201213-WA0003.mp4 -c:v libx264 -threads 3 -pix_fmt yuv420p VID-20201213-WA0003-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/VID-20201213-WA0003-out.avi.log 2>&1 
