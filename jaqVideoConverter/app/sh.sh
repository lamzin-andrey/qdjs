#! /bin/bash
cd '/home/andrey/tmp';
rm -f keosayan-2020-09-13-17-38-00-out.avi;
ffmpeg -i keosayan-2020-09-13-17-38-00.mp4 -c:v libx264 -threads 3 -pix_fmt yuv420p keosayan-2020-09-13-17-38-00-out.avi 1>/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/keosayan-2020-09-13-17-38-00-out.avi.log 2>&1 
