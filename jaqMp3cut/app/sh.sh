#! /bin/bash
cd /home/andrey/Загрузки;
rm -f 0-out.mp3
ffmpeg -i 0.mp3 -ss 00:00:00 -t 00:01:28 0-out.mp3
