#! /bin/bash
cd '/home/andrey/tmp/00/07/IV';
rm -f "Pink-out.mp3";
ffmpeg -i "Pink.mp4" -q:a 0 -map a -threads 3  "Pink-out.mp3" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/Pink-out.mp3.log" 2>&1 
