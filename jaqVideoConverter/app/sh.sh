#! /bin/bash
cd '/media/andrey/F';
rm -f "Enigma-Moment-of-peace-out.mp3";
ffmpeg -i "Enigma-Moment-of-peace.mp4" -q:a 0 -map a -threads 3  "Enigma-Moment-of-peace-out.mp3" 1>"/home/andrey/hdata/programs/my/qdjs/jaqVideoConverter/app/Enigma-Moment-of-peace-out.mp3.log" 2>&1 
