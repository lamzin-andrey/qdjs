#! /bin/bash
cd '/home/andrey/tmp/00/07/IV';
rm -f "Из кабачков-out.avi";
ffmpeg -i "Из кабачков.mp4" -c:v libx264 -threads 3 -pix_fmt yuv420p "Из кабачков-out.avi" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverterOop/app/Из кабачков-out.avi.log" 2>&1 
