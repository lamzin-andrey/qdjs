#! /bin/bash
cd '/media/andrey/F/users/Мама/media';
rm -f "Принцесса на бобах (1997) мелодрама-out.mp3";
ffmpeg -i "Принцесса на бобах (1997) мелодрама.mp4" -q:a 0 -map a -threads 3  "Принцесса на бобах (1997) мелодрама-out.mp3" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/Принцесса на бобах (1997) мелодрама-out.mp3.log" 2>&1 
