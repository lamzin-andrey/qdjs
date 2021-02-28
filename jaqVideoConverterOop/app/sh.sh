#! /bin/bash
cd '/home/andrey/tmp/00/07/IV';
rm -f "CandD-2-out.mp3";
ffmpeg -i "CandD-2.mp4" -q:a 0 -map a -threads 3  "CandD-2-out.mp3" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverterOop/app/CandD-2-out.mp3.log" 2>&1 
