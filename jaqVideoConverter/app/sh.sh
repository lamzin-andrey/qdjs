#! /bin/bash
cd '/home/andrey/hdata/Audio/Новости капитализма/0';
rm -f "01_ПЕРВЫЙ_КАНАЛ-04042021-2324-out.mp3";
ffmpeg -i "01_ПЕРВЫЙ_КАНАЛ-04042021-2324.mts" -q:a 0 -map a -threads 3  "01_ПЕРВЫЙ_КАНАЛ-04042021-2324-out.mp3" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/01_ПЕРВЫЙ_КАНАЛ-04042021-2324-out.mp3.log" 2>&1 
