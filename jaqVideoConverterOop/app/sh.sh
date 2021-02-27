#! /bin/bash
cd '/home/andrey/tmp/00/07/IV';
rm -f "В штанах-out.avi";
ffmpeg -i "В штанах.mp4" -c:v libx264 -threads 3 -pix_fmt yuv420p "В штанах-out.avi" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverterOop/app/В штанах-out.avi.log" 2>&1 
