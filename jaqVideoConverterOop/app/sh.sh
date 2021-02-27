#! /bin/bash
cd '/home/andrey/tmp/00/07/IV';
rm -f "Pink-out.avi";
ffmpeg -i "Pink.mp4" -c:v libx264 -threads 3 -pix_fmt yuv420p "Pink-out.avi" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverterOop/app/Pink-out.avi.log" 2>&1 
